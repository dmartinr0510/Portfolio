# Daniel Martín Rodríguez · Portfolio

Portfolio personal para enseñar mis proyectos y mi trayectoria como estudiante de **Desarrollo de Aplicaciones Web**. Diseñado con la paleta [Catppuccin](https://catppuccin.com) (Mocha y Latte).

## Características

- **Tema Catppuccin** oscuro (Mocha) y claro (Latte), con botón para cambiar y preferencia guardada.
- **Proyectos automáticos**: los repositorios públicos se cargan desde la API de GitHub y se actualizan cada hora, así que los nuevos aparecen solos.
- **Trayectoria**: formación, experiencia, idiomas, aptitudes y habilidades técnicas.
- **Contacto en forma de terminal bash**: el visitante escribe su nombre, email y mensaje como si usara una shell, y el mensaje llega directamente a mi correo sin mostrar la dirección en la web.
- Diseño adaptado a móvil.

## Tecnologías

- [Next.js 16](https://nextjs.org) (App Router, Server Components y Server Actions)
- React 19 y TypeScript
- Tailwind CSS v4
- [Resend](https://resend.com) para el envío de correos

## Puesta en marcha

Requisitos: Node.js 20 o superior.

```bash
npm install
```

Copia `.env.example` a `.env.local` y rellena las variables:

| Variable | Descripción |
| --- | --- |
| `RESEND_API_KEY` | Clave de API de Resend |
| `CONTACT_TO_EMAIL` | Buzón donde se reciben los mensajes del formulario |
| `CONTACT_FROM_EMAIL` | (Opcional) Remitente propio si hay un dominio verificado en Resend |

Arranca el servidor de desarrollo y abre [http://localhost:3000](http://localhost:3000):

```bash
npm run dev
```

Otros scripts: `npm run build` (compilación de producción), `npm start` y `npm run lint`.

## Estructura

```
app/
├── page.tsx                  # Página principal con todas las secciones
├── layout.tsx                # Layout, fuentes y script de tema
├── globals.css               # Paleta Catppuccin como tokens de Tailwind
├── data/profile.ts           # Información personal, formación y ajustes de repos
├── lib/github.ts             # Carga de repositorios desde la API de GitHub
├── actions/contact.ts        # Server Action que envía el correo
└── components/
    ├── ContactTerminal.tsx   # Terminal interactiva de contacto
    ├── ThemeToggle.tsx       # Cambio de tema Mocha/Latte
    └── icons.tsx
```

Para actualizar el contenido basta con editar `app/data/profile.ts`. Ahí también se pueden cambiar las descripciones de los repositorios, destacarlos u ocultarlos.

## Despliegue

Pensado para desplegarse en [Vercel](https://vercel.com): importa el repositorio y añade las variables de entorno en la configuración del proyecto.

## Contacto

- GitHub: [@dmartinr0510](https://github.com/dmartinr0510)
- O escríbeme desde la terminal de contacto del portfolio.
