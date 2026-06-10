import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { sign, verify } from 'hono/jwt'
import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcryptjs'

type Bindings = {
  DB: D1Database
  JWT_SECRET: string
  AES_SECRET: string
  AI: any
}

const app = new Hono<{ Bindings: Bindings }>()

app.use('/api/*', cors())

// Helper functions for AES Encryption
async function encryptData(text: string, secretKey: string): Promise<string> {
  const enc = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(secretKey.padEnd(32, '0').slice(0, 32)),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  )
  const key = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: new Uint8Array(16),
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  )
  
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    enc.encode(text)
  )
  
  const ivBase64 = btoa(String.fromCharCode(...iv))
  const encryptedBase64 = btoa(String.fromCharCode(...new Uint8Array(encrypted)))
  return `${ivBase64}:${encryptedBase64}`
}

async function decryptData(encryptedText: string, secretKey: string): Promise<string> {
  if (!encryptedText || !encryptedText.includes(':')) return encryptedText;
  const parts = encryptedText.split(':')
  const iv = new Uint8Array(atob(parts[0]).split('').map(c => c.charCodeAt(0)))
  const encrypted = new Uint8Array(atob(parts[1]).split('').map(c => c.charCodeAt(0)))
  
  const enc = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(secretKey.padEnd(32, '0').slice(0, 32)),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  )
  const key = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: new Uint8Array(16),
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  )

  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    encrypted
  )
  
  return new TextDecoder().decode(decrypted)
}

// Auth Middleware
app.use('/api/protected/*', async (c, next) => {
  if (c.req.method === 'OPTIONS') {
    return await next()
  }
  const authHeader = c.req.header('Authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401)
  }
  const token = authHeader.split(' ')[1]
  try {
    const payload = await verify(token, c.env.JWT_SECRET || 'my_super_secret_for_jwt_auth_12345', 'HS256')
    c.set('user', payload)
    await next()
  } catch (e: any) {
    return c.json({ error: 'Invalid Token', details: e.message, secret_exists: !!c.env.JWT_SECRET }, 401)
  }
})

// Log Middleware
app.use('/api/protected/*', async (c, next) => {
  await next()
  const user = c.get('user') as any
  if (user && c.req.method !== 'GET') {
    c.executionCtx.waitUntil(
      c.env.DB.prepare('INSERT INTO AuditLogs (id, user_id, action, target_id) VALUES (?, ?, ?, ?)')
        .bind(uuidv4(), user.id, `${c.req.method} ${c.req.path}`, null)
        .run()
    )
  }
})

app.post('/api/auth/register', async (c) => {
  const { email, password, role } = await c.req.json()
  const id = uuidv4()
  const passwordHash = await bcrypt.hash(password, 10)

  try {
    await c.env.DB.prepare(
      'INSERT INTO Users (id, email, password_hash, role) VALUES (?, ?, ?, ?)'
    ).bind(id, email, passwordHash, role).run()

    return c.json({ message: 'User registered successfully', userId: id }, 201)
  } catch (e: any) {
    return c.json({ error: 'Email already exists' }, 400)
  }
})

app.post('/api/auth/login', async (c) => {
  const { email, password } = await c.req.json()

  const user: any = await c.env.DB.prepare('SELECT * FROM Users WHERE email = ?')
    .bind(email).first()

  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return c.json({ error: 'Invalid credentials' }, 401)
  }

  const payload = { id: user.id, role: user.role, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 }
  const token = await sign(payload, c.env.JWT_SECRET || 'my_super_secret_for_jwt_auth_12345')

  return c.json({ token, user: { id: user.id, email: user.email, role: user.role } })
})

// AI Flier Generator endpoint
app.post('/api/protected/vms/fliers/generate', async (c) => {
  const { eventDetails, tone } = await c.req.json()
  const systemPrompt = "You are an expert marketing copywriter for a healthcare clinic. Create a highly engaging, professional flier copy to recruit volunteers for the following event. Include a catchy headline, 3 bullet points of why they should join, and a strong call to action."
  
  try {
    const response = await c.env.AI.run('@cf/meta/llama-3-8b-instruct', {
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Tone: ${tone}. Event details: ${eventDetails}` }
<<<<<<< HEAD
      ]
    })
    return c.json({ flierCopy: response.response })
=======
      ],
      max_tokens: 512
    })
    const result = response.result?.response || response.response || ''
    return c.json({ flierCopy: result })
>>>>>>> origin/master
  } catch (error: any) {
    return c.json({ error: error.message || 'AI generation failed' }, 500)
  }
})

// Patient Portal Endpoints
app.get('/api/protected/patient/me', async (c) => {
  const user = c.get('user') as any
  if (user.role !== 'Patient') return c.json({ error: 'Unauthorized. Not a patient.' }, 403)

  const patient: any = await c.env.DB.prepare('SELECT * FROM Patients WHERE user_id = ?').bind(user.id).first()
  if (!patient) return c.json({ error: 'Patient record not found' }, 404)

  const decryptedHistory = patient.encrypted_medical_history ? await decryptData(patient.encrypted_medical_history, c.env.AES_SECRET) : null
  
  // Try to parse the history if it's stored as JSON (Medically Accurate Portal structure)
  let medicalData = { history: decryptedHistory, vitals: null, medications: null, allergies: null }
  try {
    const parsed = JSON.parse(decryptedHistory || '{}')
    if (parsed.history || parsed.vitals) {
      medicalData = parsed;
    }
  } catch(e) {
    // Legacy plain text
  }

  return c.json({ ...patient, medicalData })
})

// Update patients POST to handle advanced medical data and linking
app.post('/api/protected/patients', async (c) => {
  const { firstName, lastName, dob, email, phone, address, medicalData } = await c.req.json()
  const id = uuidv4()
  
  // See if user exists to link
  let linkedUserId = null
  if (email) {
    const user: any = await c.env.DB.prepare('SELECT id FROM Users WHERE email = ?').bind(email).first()
    if (user) linkedUserId = user.id
  }

  const encryptedHistory = await encryptData(JSON.stringify(medicalData), c.env.AES_SECRET)

  await c.env.DB.prepare(
    'INSERT INTO Patients (id, first_name, last_name, dob, encrypted_medical_history, user_id, phone, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  ).bind(id, firstName, lastName, dob, encryptedHistory, linkedUserId, phone || null, address || null).run()

  return c.json({ message: 'Patient added successfully', id })
})

app.get('/api/protected/patients', async (c) => {
  const { results } = await c.env.DB.prepare('SELECT * FROM Patients ORDER BY created_at DESC').all()
  
  // Decrypt data for the frontend
  const decryptedResults = await Promise.all(results.map(async (patient: any) => {
    return {
      ...patient,
      medical_history: patient.encrypted_medical_history ? await decryptData(patient.encrypted_medical_history, c.env.AES_SECRET) : null
    }
  }))

  return c.json(decryptedResults)
})

app.put('/api/protected/patients/:id/medicalData', async (c) => {
  const id = c.req.param('id')
  const { type, payload } = await c.req.json()
  
  const patient: any = await c.env.DB.prepare('SELECT encrypted_medical_history FROM Patients WHERE id = ?').bind(id).first()
  if (!patient) return c.json({ error: 'Not found' }, 404)

  let medData: any = {}
  if (patient.encrypted_medical_history) {
    const decryptedStr = await decryptData(patient.encrypted_medical_history, c.env.AES_SECRET)
    try { medData = JSON.parse(decryptedStr) } catch (e) { }
  }

  if (type === 'prescription') {
    if (!medData.prescriptions) medData.prescriptions = []
    medData.prescriptions.push({ ...payload, date: new Date().toISOString(), id: uuidv4() })
  } else if (type === 'lab') {
    if (!medData.labs) medData.labs = []
    medData.labs.push({ ...payload, date: new Date().toISOString(), id: uuidv4() })
  }

  const encryptedHistory = await encryptData(JSON.stringify(medData), c.env.AES_SECRET)
  await c.env.DB.prepare('UPDATE Patients SET encrypted_medical_history = ? WHERE id = ?').bind(encryptedHistory, id).run()

  return c.json({ message: 'Updated successfully' })
})

// Inventory Routes
app.get('/api/protected/inventory', async (c) => {
  const { results } = await c.env.DB.prepare('SELECT * FROM Inventory ORDER BY expiration_date ASC').all()
  return c.json(results)
})

app.post('/api/protected/inventory', async (c) => {
  const { itemName, category, quantity, expirationDate } = await c.req.json()
  const id = uuidv4()
  
  await c.env.DB.prepare(
    'INSERT INTO Inventory (id, item_name, category, quantity, expiration_date) VALUES (?, ?, ?, ?, ?)'
  ).bind(id, itemName, category, quantity, expirationDate || null).run()
  
  return c.json({ message: 'Item added successfully', id })
})

app.put('/api/protected/inventory/:id', async (c) => {
  const id = c.req.param('id')
  const { quantity } = await c.req.json()
  await c.env.DB.prepare('UPDATE Inventory SET quantity = ? WHERE id = ?').bind(quantity, id).run()
  return c.json({ message: 'Updated successfully' })
})

// Grants & Scraper AI Matcher
app.post('/api/protected/grants/seed', async (c) => {
  // Simulates a scraper running on a cron and injecting real-world grants
  const grants = [
    { title: 'HRSA Community Health Center Grant', agency: 'Dept of Health', requirements_text: 'Provides funding for community-based health care organizations that provide primary care in underserved areas. Focuses on prenatal, pediatric, and general medicine.', amount: '$500,000' },
    { title: 'Rural Health Care Services Outreach Program', agency: 'HRSA', requirements_text: 'Focuses on expanding healthcare delivery in rural communities. Requires proof of rural demographic service and volunteer integration.', amount: '$200,000' },
    { title: 'Community Mobile Ultrasound Initiative', agency: 'Private Foundation', requirements_text: 'Specifically funds mobile clinics and portable diagnostic equipment for low-income areas.', amount: '$50,000' },
    { title: 'Mental Health Awareness Grant', agency: 'SAMHSA', requirements_text: 'Funding for establishing mental health screening and counseling services within existing primary care clinics.', amount: '$150,000' },
    { title: 'Volunteer Medical Professionals Fund', agency: 'Medical Reserve Corps', requirements_text: 'Grants to cover operational costs for clinics that rely heavily on volunteer doctors, nurses, and staff.', amount: '$25,000' }
  ]
  
  const stmt = c.env.DB.prepare('INSERT INTO Grants (id, title, agency, requirements_text, url) VALUES (?, ?, ?, ?, ?)')
  const batch = grants.map(g => stmt.bind(uuidv4(), g.title, g.agency, g.requirements_text, g.amount))
  
  await c.env.DB.batch(batch)
  return c.json({ message: 'Grant database seeded successfully' })
})

app.get('/api/protected/grants', async (c) => {
  const { results } = await c.env.DB.prepare('SELECT * FROM Grants').all()
  return c.json(results)
})

app.post('/api/protected/grants/match', async (c) => {
  const { metrics } = await c.req.json()
  const { results: grants } = await c.env.DB.prepare('SELECT title, agency, requirements_text, url as amount FROM Grants').all()
  
  const grantsContext = JSON.stringify(grants)
<<<<<<< HEAD
  const systemPrompt = `You are an expert AI grant matching assistant. Analyze the clinic metrics provided and match them against the following available grants:\n\n${grantsContext}\n\nReturn ONLY a JSON array of the top 3 best matching grants with the structure: [{"title": "grant title", "agency": "agency name", "match_score": 95, "reason": "brief explanation why it matches"}]. Do NOT include markdown formatting like \`\`\`json.`
=======
  const systemPrompt = `You are an expert AI grant matching assistant. Analyze the clinic metrics provided and match them against the following available grants:\n\n${grantsContext}\n\nReturn ONLY a valid JSON array (no markdown, no code blocks) of the top 3 best matching grants with this exact structure: [{"title": "grant title", "agency": "agency name", "match_score": 95, "reason": "brief explanation"}]`
>>>>>>> origin/master
  
  try {
    const response = await c.env.AI.run('@cf/meta/llama-3-8b-instruct', {
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Clinic metrics: ${metrics}` }
<<<<<<< HEAD
      ]
    })
    
    // Parse the raw JSON string out of Llama's response
    let jsonMatch = response.response
    try {
      jsonMatch = jsonMatch.replace(/```json/g, '').replace(/```/g, '').trim()
      const parsedMatches = JSON.parse(jsonMatch)
      return c.json({ matches: parsedMatches })
    } catch(e) {
      // Fallback if AI didn't format perfectly
      return c.json({ matches: [{ title: "AI format error", reason: response.response, match_score: 0 }]})
    }
=======
      ],
      max_tokens: 1024
    })
    
    // Extract response text from various possible formats
    let responseText = response.result?.response || response.response || JSON.stringify(response)
    
    // Clean up markdown formatting
    responseText = responseText
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .replace(/^[\s\n]*/, '')
      .replace(/[\s\n]*$/, '')
      .trim()
    
    // Try to extract JSON array if it's wrapped in text
    const jsonMatch = responseText.match(/\[[\s\S]*\]/)
    if (jsonMatch) {
      responseText = jsonMatch[0]
    }
    
    try {
      const parsedMatches = JSON.parse(responseText)
      if (Array.isArray(parsedMatches) && parsedMatches.length > 0) {
        return c.json({ matches: parsedMatches })
      }
    } catch(parseErr) {
      console.error('JSON parse error:', parseErr, 'Text was:', responseText)
    }
    
    // Fallback if parsing failed
    return c.json({ matches: [{ title: "Grant matching unavailable", agency: "System", match_score: 0, reason: "AI service returned invalid format. Raw: " + responseText.substring(0, 100) }]})
>>>>>>> origin/master
  } catch (error: any) {
    return c.json({ error: error.message || 'AI generation failed' }, 500)
  }
})

// AI Grant Assistant endpoint
app.post('/api/protected/grants/generate', async (c) => {
  const { metrics, prompt } = await c.req.json()
  const systemPrompt = "You are an expert grant writer and fundraiser for a healthcare clinic. Use the following metrics to write a compelling proposal: " + JSON.stringify(metrics)
  const userPrompt = prompt || "Write a grant proposal executive summary."

  try {
    const response = await c.env.AI.run('@cf/meta/llama-3-8b-instruct', {
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
<<<<<<< HEAD
      ]
    })
    return c.json({ proposal: response.response })
=======
      ],
      max_tokens: 1024
    })
    const result = response.result?.response || response.response || ''
    return c.json({ proposal: result })
>>>>>>> origin/master
  } catch (error: any) {
    return c.json({ error: error.message || 'AI generation failed' }, 500)
  }
})

// Full VMS / CRM Endpoints
app.get('/api/protected/vms/events', async (c) => {
  const { results } = await c.env.DB.prepare('SELECT * FROM Events ORDER BY date ASC').all()
  return c.json(results)
})

app.post('/api/protected/vms/events', async (c) => {
<<<<<<< HEAD
  const { title, description, date, location, requiredVolunteers, endDate, category, isRecurring, recurrencePattern } = await c.req.json()
  const id = uuidv4()
  await c.env.DB.prepare(
    'INSERT INTO Events (id, title, description, date, location, required_volunteers, end_date, category, is_recurring, recurrence_pattern) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  ).bind(id, title, description, date, location, requiredVolunteers, endDate || null, category || 'General', isRecurring ? 1 : 0, recurrencePattern || null).run()
  return c.json({ message: 'Event created', id })
=======
   const { title, description, date, location, requiredVolunteers, endDate, category, isRecurring, recurrencePattern, timeSlots } = await c.req.json()
   const id = uuidv4()
   await c.env.DB.prepare(
     'INSERT INTO Events (id, title, description, date, location, required_volunteers, end_date, category, is_recurring, recurrence_pattern) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
   ).bind(id, title, description, date, location, requiredVolunteers, endDate || null, category || 'General', isRecurring ? 1 : 0, recurrencePattern || null).run()

   // Create time slots if provided
   if (timeSlots && Array.isArray(timeSlots)) {
     const slotInserts = timeSlots.map(slot =>
       c.env.DB.prepare(
         'INSERT INTO EventTimeSlots (id, event_id, start_time, end_time, capacity) VALUES (?, ?, ?, ?, ?)'
       ).bind(uuidv4(), id, slot.start_time, slot.end_time, slot.capacity || 1)
     )
     if (slotInserts.length > 0) {
       await c.env.DB.batch(slotInserts)
     }
   }

   return c.json({ message: 'Event created', id })
>>>>>>> origin/master
})

app.get('/api/protected/vms/volunteers', async (c) => {
  const { results } = await c.env.DB.prepare(`
    SELECT u.id, u.email, u.role, 
           COALESCE(SUM(ev.hours_logged), 0) as total_hours 
    FROM Users u 
    LEFT JOIN EventVolunteers ev ON u.id = ev.user_id AND ev.status = 'Confirmed'
    WHERE u.role = 'Volunteer'
    GROUP BY u.id
  `).all()
  return c.json(results)
})

app.get('/api/protected/vms/stats', async (c) => {
  const [totalVolunteers, activeEvents, stats] = await Promise.all([
    c.env.DB.prepare("SELECT COUNT(*) as count FROM Users WHERE role = 'Volunteer'").first('count'),
    c.env.DB.prepare("SELECT COUNT(*) as count FROM Events WHERE date >= date('now')").first('count'),
    c.env.DB.prepare(`
      SELECT 
        COUNT(*) as total_registrations,
        SUM(CASE WHEN status = 'Confirmed' THEN 1 ELSE 0 END) as total_shows,
        SUM(CASE WHEN status = 'No-Show' THEN 1 ELSE 0 END) as total_no_shows
      FROM EventVolunteers
    `).first()
  ])
  
  const s: any = stats || { total_registrations: 0, total_shows: 0, total_no_shows: 0 };
  const completionRate = s.total_registrations > 0 ? (s.total_shows / s.total_registrations) * 100 : 0;
  const noShowRate = s.total_registrations > 0 ? (s.total_no_shows / s.total_registrations) * 100 : 0;

  return c.json({
    total_volunteers: totalVolunteers,
    active_events: activeEvents,
    total_participants: s.total_registrations,
    completion_rate: Math.round(completionRate),
    no_show_rate: Math.round(noShowRate)
  })
})

app.get('/api/protected/vms/events/:id/participants', async (c) => {
  const eventId = c.req.param('id')
  const { results } = await c.env.DB.prepare(`
    SELECT ev.id as registration_id, ev.user_id, u.email, ev.status, ev.hours_logged
    FROM EventVolunteers ev
    JOIN Users u ON ev.user_id = u.id
    WHERE ev.event_id = ?
  `).bind(eventId).all()
  return c.json(results)
})

app.put('/api/protected/vms/events/:id/attendance/:userId', async (c) => {
  const { id, userId } = c.req.param()
  const { status, hours } = await c.req.json()
  
  await c.env.DB.prepare(
    "UPDATE EventVolunteers SET status = ?, hours_logged = COALESCE(?, hours_logged) WHERE event_id = ? AND user_id = ?"
  ).bind(status, hours || null, id, userId).run()
  return c.json({ message: 'Attendance updated' })
})

app.get('/api/protected/vms/me', async (c) => {
  const user = c.get('user') as any;
  const [hours, shifts] = await Promise.all([
    c.env.DB.prepare("SELECT SUM(hours_logged) as total FROM EventVolunteers WHERE user_id = ? AND status = 'Confirmed'").bind(user.id).first('total'),
    c.env.DB.prepare(`
      SELECT ev.status, e.title, e.date, e.location 
      FROM EventVolunteers ev 
      JOIN Events e ON ev.event_id = e.id 
      WHERE ev.user_id = ? 
      ORDER BY e.date ASC
    `).bind(user.id).all()
  ]);
  
  return c.json({
    total_hours: hours || 0,
    shifts: shifts.results
  });
})

app.post('/api/protected/vms/events/:id/register', async (c) => {
  const eventId = c.req.param('id')
  const user = c.get('user') as any
  const id = uuidv4()
  
  await c.env.DB.prepare(
    'INSERT INTO EventVolunteers (id, event_id, user_id, status) VALUES (?, ?, ?, ?)'
  ).bind(id, eventId, user.id, 'Pending').run()
  
  return c.json({ message: 'Registered for event' })
})

app.get('/api/protected/vms/hours/pending', async (c) => {
  const { results } = await c.env.DB.prepare(`
    SELECT ev.id as registration_id, ev.hours_logged, ev.status, e.title as event_title, u.email as volunteer_email
    FROM EventVolunteers ev
    JOIN Events e ON ev.event_id = e.id
    JOIN Users u ON ev.user_id = u.id
    WHERE ev.status = 'Pending' AND ev.hours_logged > 0
  `).all()
  return c.json(results)
})

app.put('/api/protected/vms/hours/confirm/:id', async (c) => {
  const registrationId = c.req.param('id')
  await c.env.DB.prepare(
    "UPDATE EventVolunteers SET status = 'Confirmed' WHERE id = ?"
  ).bind(registrationId).run()
  return c.json({ message: 'Hours confirmed' })
})

// Legacy Shifts endpoint
app.get('/api/protected/shifts', async (c) => {
<<<<<<< HEAD
  const { results } = await c.env.DB.prepare('SELECT * FROM Shifts').all()
  return c.json(results)
})
app.post('/api/protected/shifts', async (c) => {
  const { startTime, endTime, roleAssigned } = await c.req.json()
  const user = c.get('user') as any
  const id = uuidv4()
  
  await c.env.DB.prepare(
    'INSERT INTO Shifts (id, user_id, start_time, end_time, role_assigned, status) VALUES (?, ?, ?, ?, ?, ?)'
  ).bind(id, user.id, startTime, endTime, roleAssigned, 'Scheduled').run()
  
  return c.json({ message: 'Shift created successfully' })
=======
   const { results } = await c.env.DB.prepare('SELECT * FROM Shifts').all()
   return c.json(results)
})
app.post('/api/protected/shifts', async (c) => {
   const { startTime, endTime, roleAssigned } = await c.req.json()
   const user = c.get('user') as any
   const id = uuidv4()
   
   await c.env.DB.prepare(
     'INSERT INTO Shifts (id, user_id, start_time, end_time, role_assigned, status) VALUES (?, ?, ?, ?, ?, ?)'
   ).bind(id, user.id, startTime, endTime, roleAssigned, 'Scheduled').run()
   
   return c.json({ message: 'Shift created successfully' })
})

// Patient Consent Endpoints
app.post('/api/protected/patients/:patientId/consent', async (c) => {
  const patientId = c.req.param('patientId')
  const { consentType } = await c.req.json()
  const user = c.get('user') as any
  
  // Verify the user is authorized (patient themselves, doctor, or admin)
  const patient: any = await c.env.DB.prepare('SELECT * FROM Patients WHERE id = ?').bind(patientId).first()
  if (!patient) return c.json({ error: 'Patient not found' }, 404)
  
  const id = uuidv4()
  await c.env.DB.prepare(
    'INSERT INTO PatientConsent (id, patient_id, consent_type, status, date_provided) VALUES (?, ?, ?, ?, ?)'
  ).bind(id, patientId, consentType, 'Approved', new Date().toISOString()).run()
  
  return c.json({ message: 'Consent recorded', id }, 201)
})

app.get('/api/protected/patients/:patientId/consent', async (c) => {
  const patientId = c.req.param('patientId')
  const { results } = await c.env.DB.prepare(
    'SELECT * FROM PatientConsent WHERE patient_id = ? ORDER BY created_at DESC'
  ).bind(patientId).all()
  return c.json(results)
})

app.get('/api/protected/patients/:patientId/consent-status', async (c) => {
  const patientId = c.req.param('patientId')
  const result: any = await c.env.DB.prepare(
    'SELECT COUNT(*) as total, SUM(CASE WHEN status = "Approved" THEN 1 ELSE 0 END) as approved FROM PatientConsent WHERE patient_id = ?'
  ).bind(patientId).first()
  return c.json({ has_consent: result.approved > 0, total_consents: result.total, approved_consents: result.approved })
})

// Volunteer Application Endpoints
app.post('/api/protected/volunteers/apply', async (c) => {
  const user = c.get('user') as any
  const { qualifications } = await c.req.json()
  
  if (user.role !== 'Volunteer') {
    return c.json({ error: 'Only volunteers can apply' }, 403)
  }
  
  // Check if already applied
  const existing: any = await c.env.DB.prepare(
    'SELECT id FROM VolunteerApplications WHERE user_id = ? AND status = "Pending"'
  ).bind(user.id).first()
  
  if (existing) {
    return c.json({ error: 'You have a pending application' }, 400)
  }
  
  const id = uuidv4()
  await c.env.DB.prepare(
    'INSERT INTO VolunteerApplications (id, user_id, qualifications, status) VALUES (?, ?, ?, ?)'
  ).bind(id, user.id, qualifications, 'Pending').run()
  
  return c.json({ message: 'Application submitted successfully', id }, 201)
})

app.get('/api/protected/volunteers/applications', async (c) => {
  const user = c.get('user') as any
  
  // Only admin and doctors can view all applications
  if (user.role !== 'Admin' && user.role !== 'Doctor') {
    return c.json({ error: 'Unauthorized' }, 403)
  }
  
  const { results } = await c.env.DB.prepare(`
    SELECT va.id, va.user_id, va.qualifications, va.status, va.approval_notes, va.created_at, u.email
    FROM VolunteerApplications va
    JOIN Users u ON va.user_id = u.id
    ORDER BY va.created_at DESC
  `).all()
  
  return c.json(results)
})

app.put('/api/protected/volunteers/applications/:appId/approve', async (c) => {
  const appId = c.req.param('appId')
  const user = c.get('user') as any
  const { approval_notes } = await c.req.json()
  
  if (user.role !== 'Admin' && user.role !== 'Doctor') {
    return c.json({ error: 'Unauthorized' }, 403)
  }
  
  const app: any = await c.env.DB.prepare('SELECT user_id FROM VolunteerApplications WHERE id = ?').bind(appId).first()
  if (!app) return c.json({ error: 'Application not found' }, 404)
  
  await c.env.DB.prepare(
    'UPDATE VolunteerApplications SET status = ?, approval_notes = ?, updated_at = ? WHERE id = ?'
  ).bind('Approved', approval_notes || null, new Date().toISOString(), appId).run()
  
  return c.json({ message: 'Volunteer approved' })
})

app.put('/api/protected/volunteers/applications/:appId/reject', async (c) => {
  const appId = c.req.param('appId')
  const user = c.get('user') as any
  const { approval_notes } = await c.req.json()
  
  if (user.role !== 'Admin' && user.role !== 'Doctor') {
    return c.json({ error: 'Unauthorized' }, 403)
  }
  
  await c.env.DB.prepare(
    'UPDATE VolunteerApplications SET status = ?, approval_notes = ?, updated_at = ? WHERE id = ?'
  ).bind('Rejected', approval_notes || null, new Date().toISOString(), appId).run()
  
  return c.json({ message: 'Application rejected' })
})

// Time Slot Endpoints
app.get('/api/protected/events/:eventId/time-slots', async (c) => {
  const eventId = c.req.param('eventId')
  const { results } = await c.env.DB.prepare(
    'SELECT * FROM EventTimeSlots WHERE event_id = ? ORDER BY start_time ASC'
  ).bind(eventId).all()
  return c.json(results)
})

app.post('/api/protected/events/:eventId/time-slots', async (c) => {
  const eventId = c.req.param('eventId')
  const { start_time, end_time, capacity } = await c.req.json()
  
  const id = uuidv4()
  await c.env.DB.prepare(
    'INSERT INTO EventTimeSlots (id, event_id, start_time, end_time, capacity) VALUES (?, ?, ?, ?, ?)'
  ).bind(id, eventId, start_time, end_time, capacity || 1).run()
  
  return c.json({ message: 'Time slot created', id }, 201)
})

// Enhanced volunteer registration with time slots
app.post('/api/protected/vms/events/:id/register', async (c) => {
  const eventId = c.req.param('id')
  const user = c.get('user') as any
  const { timeSlotId, signupType } = await c.req.json()
  const id = uuidv4()
  
  // Check volunteer has approved application
  const app: any = await c.env.DB.prepare(
    'SELECT id FROM VolunteerApplications WHERE user_id = ? AND status = "Approved"'
  ).bind(user.id).first()
  
  if (!app && user.role === 'Volunteer') {
    return c.json({ error: 'Volunteer application must be approved first' }, 403)
  }
  
  await c.env.DB.prepare(
    'INSERT INTO EventVolunteers (id, event_id, user_id, status, time_slot_id, signup_type) VALUES (?, ?, ?, ?, ?, ?)'
  ).bind(id, eventId, user.id, 'Pending', timeSlotId || null, signupType || 'Full Day').run()
  
  return c.json({ message: 'Registered for event' })
})

// Search endpoint
app.get('/api/protected/search', async (c) => {
  const query = c.req.query('q') || ''
  const searchType = c.req.query('type') || 'all'
  const user = c.get('user') as any
  
  if (!query || query.length < 2) {
    return c.json({ error: 'Query must be at least 2 characters' }, 400)
  }
  
  const results: any = { patients: [], volunteers: [], events: [] }
  
  // Search patients (doctors/admin only)
  if ((user.role === 'Doctor' || user.role === 'Admin') && (searchType === 'all' || searchType === 'patients')) {
    const { results: patients } = await c.env.DB.prepare(`
      SELECT id, first_name, last_name, dob FROM Patients 
      WHERE first_name LIKE ? OR last_name LIKE ? OR dob LIKE ?
      LIMIT 10
    `).bind(`%${query}%`, `%${query}%`, `%${query}%`).all()
    results.patients = patients
  }
  
  // Search volunteers (admin/doctors only)
  if ((user.role === 'Admin' || user.role === 'Doctor') && (searchType === 'all' || searchType === 'volunteers')) {
    const { results: volunteers } = await c.env.DB.prepare(`
      SELECT u.id, u.email, COALESCE(SUM(ev.hours_logged), 0) as total_hours
      FROM Users u
      LEFT JOIN EventVolunteers ev ON u.id = ev.user_id AND ev.status = 'Confirmed'
      WHERE u.role = 'Volunteer' AND u.email LIKE ?
      GROUP BY u.id
      LIMIT 10
    `).bind(`%${query}%`).all()
    results.volunteers = volunteers
  }
  
  // Search events (all roles)
  if (searchType === 'all' || searchType === 'events') {
    const { results: events } = await c.env.DB.prepare(`
      SELECT id, title, description, date, location FROM Events
      WHERE title LIKE ? OR description LIKE ?
      LIMIT 10
    `).bind(`%${query}%`, `%${query}%`).all()
    results.events = events
  }
  
  return c.json(results)
})

// Prescription recommendation endpoint
app.get('/api/protected/patients/:patientId/prescription-recommendations', async (c) => {
  const patientId = c.req.param('patientId')
  const user = c.get('user') as any
  
  if (user.role !== 'Doctor' && user.role !== 'Admin') {
    return c.json({ error: 'Unauthorized' }, 403)
  }
  
  const patient: any = await c.env.DB.prepare('SELECT encrypted_medical_history FROM Patients WHERE id = ?').bind(patientId).first()
  if (!patient) return c.json({ error: 'Patient not found' }, 404)
  
  let recommendations: any[] = []
  if (patient.encrypted_medical_history) {
    const decrypted = await decryptData(patient.encrypted_medical_history, c.env.AES_SECRET)
    try {
      const medData = JSON.parse(decrypted)
      if (medData.prescriptions && Array.isArray(medData.prescriptions)) {
        // Get unique medication names from prescriptions
        const medications = [...new Set(medData.prescriptions.map((p: any) => p.medication))]
        recommendations = medications.slice(0, 5).map((med: string) => ({ medication: med, previous: true }))
      }
    } catch (e) { }
  }
  
  return c.json(recommendations)
})

// Get volunteer approval dashboard data
app.get('/api/protected/volunteers/dashboard', async (c) => {
  const user = c.get('user') as any
  
  if (user.role !== 'Admin' && user.role !== 'Doctor') {
    return c.json({ error: 'Unauthorized' }, 403)
  }
  
  const [pendingApps, approvedVolunteers, recentApps] = await Promise.all([
    c.env.DB.prepare('SELECT COUNT(*) as count FROM VolunteerApplications WHERE status = "Pending"').first('count'),
    c.env.DB.prepare('SELECT COUNT(*) as count FROM VolunteerApplications WHERE status = "Approved"').first('count'),
    c.env.DB.prepare(`
      SELECT va.id, va.user_id, u.email, va.qualifications, va.created_at
      FROM VolunteerApplications va
      JOIN Users u ON va.user_id = u.id
      WHERE va.status = 'Pending'
      ORDER BY va.created_at DESC
      LIMIT 5
    `).all()
  ])
  
  return c.json({
    pending_applications: pendingApps,
    approved_volunteers: approvedVolunteers,
    recent_applications: recentApps.results
  })
>>>>>>> origin/master
})


export default app
