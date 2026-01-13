# Dropshipping Store (Scaffold)

Proyecto scaffold inicial para una tienda dropshipping usando Next.js + Tailwind + Prisma (SQLite) + Stripe.

Qué incluye:

- Next.js (TypeScript)
- Tailwind CSS
- Prisma con SQLite
- Estructura básica de páginas: Home, Product, Cart, Checkout
- API routes para órdenes y webhooks
- Carpeta `integrations` para adaptadores de proveedores

Cómo empezar:

1. Instala dependencias:

```bash
npm install
```

2. Base de datos (Neon / Postgres)

Este scaffold usa Prisma y puedes usar Neon (Postgres) como base de datos en producción.

En desarrollo local puedes usar DATABASE_URL="postgresql://user:pass@localhost:5432/dbname"

Para inicializar Prisma:

```bash
npx prisma migrate dev --name init
```

3. Ejecuta en modo desarrollo:

```bash
npm run dev
```

4. Configura variables de entorno en `.env` (DATABASE_URL, STRIPE_SECRET_KEY)

Despliegue:
- Vercel: buena integración con Next.js. Añade `DATABASE_URL` en Variables de Entorno.
- Render: puede alojar la app si prefieres, también configure `DATABASE_URL`.
- Neon: crea un cluster, copia la `DATABASE_URL` en Vercel/Render.

Stripe (pagos):

- Añade en tu `.env`:

```
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
NEXT_PUBLIC_URL=https://tu-dominio.vercel.app
```

- Endpoints creados:
	- `POST /api/stripe/create-checkout-session` — crea una sesión de checkout.
	- `POST /api/stripe/webhook` — recibe eventos de Stripe (configura webhook en el Dashboard).

En Vercel añade `STRIPE_WEBHOOK_SECRET` y pon el endpoint de webhook con la URL: `https://<tu-proyecto>.vercel.app/api/stripe/webhook`.

.env example:

```
See `.env.example` in the repository for a quick template. Fill `DATABASE_URL`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` and `NEXT_PUBLIC_URL`.
```

Quick test (checkout flow):

1. Start dev server:

```bash
npm run dev
```

2. Use the frontend cart page (`/cart`) to post items to `/api/cart` and then hit `/api/stripe/create-checkout-session` to get a Checkout URL.

3. Configure webhook using the `STRIPE_WEBHOOK_SECRET` in Vercel/Render or use `stripe listen` locally for testing.

Siguientes pasos: conectar proveedores, configurar Stripe, y desplegar.
