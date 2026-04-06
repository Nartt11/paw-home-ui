# API Contract

## Auth

POST /api/auth/login

Request:
{
email: string
password: string
}

Response:
{
accessToken: string
refreshToken: string
user: {
id: string
name: string
role: string
}
}

---

## Pets

GET /api/pets

Response:
Pet[]
