# Alkemy Movies DB

API para administración de películas/series. La misma cuenta con suscripción de usuarios que envía mails de registración. Permite registrar y administrar films con sus personajes.

# Required

## Environment variables

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `MYSQL_DATABASE` | `string` | **Required**. Database name MYSQL |
| `MYSQL_HOST` | `string` | **Required**. Host MYSQL |
| `MYSQL_PORT` | `string` | **Required**. Port MYSQL |
| `MYSQL_USER` | `string` | **Required**. User MYSQL  |
| `MYSQL_PASS` | `string` | Password MYSQL |
| `EXPRESS_PORT` | `string` | **Required**. Express port |
| `JWT_PASS` | `string` | **Required**. Word to encrypt token |
| `CRYPTO_KEY` | `string` | **Required**. Word to encrypt user's password |
| `SENDGRID_API_KEY` | `string` | **Required**. Sendgrid API key |
| `SENDGRID_API_SENDER` | `string` | **Required**. Non-public mail sender |

## Node 
Instalar dependencias

```bash
npm install
```

Iniciar API

```bash
npm run dev
```
