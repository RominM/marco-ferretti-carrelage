import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// Remplacer hello@domaine-client.fr par le vrai domaine une fois défini
const FROM_SITE    = 'Ferretti Carrelage <hello@domaine-client.fr>'
const FROM_NOTIF   = 'Formulaire devis <hello@domaine-client.fr>'

export default async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const formData = await req.formData()
  const name        = formData.get('name')?.toString().trim() ?? ''
  const email       = formData.get('email')?.toString().trim() ?? ''
  const phone       = formData.get('phone')?.toString().trim() ?? ''
  const serviceType = formData.get('serviceType')?.toString().trim() ?? ''
  const surface     = formData.get('surface')?.toString().trim() ?? ''
  const deadline    = formData.get('deadline')?.toString().trim() ?? ''
  const description = formData.get('description')?.toString().trim() ?? ''

  if (!name || !email || !phone || !serviceType || !description) {
    return new Response('Champs requis manquants', { status: 400 })
  }

  await resend.emails.send({
    from: FROM_SITE,
    to: email,
    replyTo: FROM_SITE,
    subject: 'Votre demande de devis — Ferretti Carrelage',
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 540px; margin: 0 auto;">
        <div style="background: #E0621C; padding: 28px 32px; border-radius: 8px 8px 0 0;">
          <p style="color: white; font-size: 20px; font-weight: 700; margin: 0;">Ferretti Carrelage</p>
          <p style="color: rgba(255,255,255,0.85); font-size: 13px; margin: 4px 0 0;">Artisan carreleur dans l'Hérault</p>
        </div>
        <div style="background: #ffffff; border: 1px solid #EDE8E0; border-top: none; padding: 32px; border-radius: 0 0 8px 8px;">
          <p style="color: #1C1916; font-size: 16px; margin: 0 0 16px;">Bonjour ${name},</p>
          <p style="color: #6B6460; font-size: 15px; line-height: 1.7; margin: 0 0 24px;">
            Votre demande de devis a bien été reçue. Marco vous répondra personnellement
            sous 48h, du lundi au vendredi de 8h30 à 19h00.
          </p>
          <div style="background: #F9F8F6; border-left: 3px solid #E0621C; padding: 16px 20px; border-radius: 4px; margin-bottom: 24px;">
            <p style="color: #1C1916; font-size: 13px; font-weight: 700; margin: 0 0 8px; text-transform: uppercase; letter-spacing: 0.05em;">Récapitulatif de votre demande</p>
            <p style="color: #6B6460; font-size: 14px; margin: 0; line-height: 1.7;">
              <strong>Type :</strong> ${serviceType}<br/>
              ${surface ? `<strong>Surface :</strong> ${surface} m²<br/>` : ''}
              ${deadline ? `<strong>Délai :</strong> ${deadline}<br/>` : ''}
              <strong>Projet :</strong> ${description.replace(/\n/g, '<br/>')}
            </p>
          </div>
          <p style="color: #6B6460; font-size: 14px; line-height: 1.7; margin: 0;">
            À bientôt,<br/>
            <strong style="color: #1C1916;">Marco Ferretti</strong><br/>
            Ferretti Carrelage · Villeneuve-lès-Béziers
          </p>
        </div>
      </div>
    `,
  })

  await resend.emails.send({
    from: FROM_NOTIF,
    to: process.env.NOTIFICATION_EMAIL,
    replyTo: email,
    subject: `Nouveau devis — ${name} (${serviceType})`,
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 540px;">
        <p><strong>Nom :</strong> ${name}</p>
        <p><strong>Email :</strong> ${email}</p>
        <p><strong>Téléphone :</strong> ${phone}</p>
        <p><strong>Type de prestation :</strong> ${serviceType}</p>
        ${surface ? `<p><strong>Surface :</strong> ${surface} m²</p>` : ''}
        ${deadline ? `<p><strong>Délai :</strong> ${deadline}</p>` : ''}
        <p><strong>Description :</strong></p>
        <p>${description.replace(/\n/g, '<br/>')}</p>
      </div>
    `,
  })

  return Response.redirect(new URL('/merci', req.url), 303)
}

export const config = { path: '/api/contact' }
