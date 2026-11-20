# API Contract

Base URL: `NEXT_PUBLIC_API_URL` (ends with `/api/v1`). Every response is wrapped:

```
{ success, status, message, data, errorCode?, timestamp, correlationId }
```

`lib/http.ts` returns `data` and throws `HttpError` (`status`, `message`, `errorCode`) on failure.
`errorCode` is only present on business errors; use it, not the message, to decide what to tell the user.

## Dates and times

- Every date-time the API sends is UTC with a trailing `Z`, e.g. `2026-11-12T10:00:00Z`; the
  fraction may have up to 9 digits (`...:01.123456Z`).
- Send date-times with an offset: `Z` or `+07:00`. A value without one is read as UTC; a date alone
  (`2026-11-12`) as the start of that day in Vietnam.
- Cursors (`nextCursor`) go back exactly as received.
- Never call `new Date()` or `toLocale*()` on API values directly. Use `lib/datetime.ts`:
  `formatDate`, `formatDateTime`, `formatRelativeTime` show times in Vietnam whatever the
  browser's zone; `toApiDateTime` turns a date or datetime-local input into a value with
  `+07:00`; `toDateTimeLocalValue` and `toDateInputValue` fill those inputs.

The sections below are checked against the backend code. Anything not listed here: read the
controller, do not guess.

---

## Auth

POST /auth/login

Request:
{
emailOrUsername: string
password: string
}

Response `data`:
{
accessToken: string
refreshToken: string
...
}

---

## Community feed and rescue cases

Most people meet a rescue case in the feed, not on the map.

A post stands on its own: text, images, likes, comments and a link that can be shared. It **may**
be about one rescue case; then the case stays the source of truth and the post only points to it.
In the feed such a post shows a small bar ("Ca cứu hộ R-0090 · Đang chờ giúp · Xem ca") that opens
the case separately with `GET /rescue-cases/{id}`; the case is not embedded in the post.

### GET /posts/feed (public)

Query: `pageSize`, `cursor`, `cursorId`, and optional filters `category`
(`RESCUE | ADOPTION | LOST | FOUND | GENERAL`), `species`, `district`, `province`, `needsRescue`,
`tag`, `rescueCaseId`, `hasOpenCase`.

- Paging: send back **both** `nextCursor` as `cursor` and `nextCursorId` as `cursorId`.
- `rescueCaseId`: posts about one case. `hasOpenCase=true`: posts whose case still needs help.
- An unknown `category` is a 400.

Response `data`:
{
items: PostSummary[]
nextCursor?: string
nextCursorId?: string
hasMore: boolean
}

PostSummary:
{
postId, authorId, authorUsername, authorAvatarUrl?
content: string
tags: string[]
imageUrls: string[]
likeCount, commentCount: number
likedByMe?: boolean // absent for guests
createdAt: string
facets?: { category, species?, district?, province?, needsRescue } // labels the author confirmed
rescueCase?: PostRescueCase // null when the post is not about a case
}

PostRescueCase (read fresh from the case on every request, never a stale copy):
{
caseId, caseCode: string
status: "REPORTED" | "IN_PROGRESS" | "RESCUED" | "CLOSED"
open: boolean // true for REPORTED and IN_PROGRESS
priority?: "LOW" | "NORMAL" | "HIGH" | "CRITICAL"
species?, locationText?, provinceName?: string
imageUrl?: string // first image of the case
}

### POST /posts (signed in)

Request:
{
content: string // max 2000
rescueCaseId?: string
mediaIds: string[]
tagCodes: string[]
}

Linking rules, all returned with an `errorCode`:

| errorCode | status | Meaning |
| --- | --- | --- |
| `POST_RESCUE_CASE_NOT_FOUND` | 400 | The case does not exist |
| `POST_RESCUE_CASE_CLOSED` | 409 | Only cases that still need help can be linked |
| `POST_RESCUE_CASE_ALREADY_SHARED` | 409 | One post per author per case |

`mediaIds` are ids returned by `POST /media/upload/temp` (max 10). The post keeps the images;
they come back as `imageUrls`.

### GET /posts/{id} (public)

So a shared link (`/cong-dong/{postId}`) opens for whoever receives it. Same fields as a feed item,
plus `likedByMe` when the caller is signed in. `GET /posts` (the paged list) still needs sign-in.

### Likes (signed in)

- `POST /posts/{postId}/like` and `DELETE /posts/{postId}/like` → `{ targetId, liked }`.
- Counters are updated asynchronously on the server. The UI flips the heart and the count at once
  (`useTogglePostLike`) and puts them back if the call fails.

### Comments

- `GET /posts/{postId}/comments` (public): top-level comments, newest first.
  Query `pageSize`, `cursor` (= `nextCursor` of the previous page).
  Response `data`: `{ items: PostComment[], nextCursor?, hasMore }`.
- `POST /posts/{postId}/comments` (signed in): `{ content: string, parentCommentId?: string }`.

PostComment:
{
commentId, postId, authorId, authorUsername: string
parentCommentId?: string
content: string
likeCount, replyCount: number
createdAt: string
}

Replies (`GET /comments/{id}/replies`) and comment likes exist on the backend but have no screen yet.

### PUT /posts/{id} (author or admin)

Same body as create, plus:

- `rescueCaseId`: link to this case, replacing the current link (same rules as above).
- `removeRescueCase: true`: remove the link.

### POST /rescue-cases (signed in)

The usual report body, plus:

- `shareAsPost?: boolean` – also publish a community post about the case.
- `postContent?: string` – text of that post; empty lets the backend write one from the species,
  the place and the description.

The case is saved first. Response `data` then also carries:

- `sharedPostId?: string` – the post that was published.
- `postShareFailed?: boolean` – true when the case was saved but the post was not. Still a 201:
  tell the user the case is in, and that they can share it from the community page.

The post has no images of its own; its card shows the first image of the case.

### GET /rescue-cases (public)

Query: `page`, `pageSize`, `search`, `status` (repeat the key), `priority` (repeat the key),
`species`, `province` (code or name). With `lat` + `lng` (+ `distance` in metres, default 5000)
the nearest cases come first and each row has `distanceMeters`.

Send arrays as repeated keys (`status=REPORTED&status=IN_PROGRESS`); see `repeatArrayKeys` in
`services/rescue-case/rescue-case.ts`.

### GET /users/me/rescue-cases (signed in)

Cases the caller reported, newest first. Query: `page`, `pageSize`, `status` (repeat the key).
Same row shape as `GET /rescue-cases`.

### GET /users/me/rescue-claims (signed in)

Cases the caller is working on:
{ claimId, caseId, caseCode, status, claimedAt, expiresAt? }[]

---

## Where this is used

| Screen | Files |
| --- | --- |
| Community feed `/cong-dong` | `app/(public)/cong-dong/page.tsx`, `components/community/*` |
| One post, the target of a shared link `/cong-dong/{postId}` | `app/(public)/cong-dong/[postId]/page.tsx` |
| Like, comment, share on a post | `components/community/PostCard.tsx`, `CommentSection.tsx`, `hooks/use-post-interactions.ts` |
| Opening a post's rescue case | `components/community/RescueCaseDialog.tsx` |
| Case picker in the composer | `components/community/RescueCasePicker.tsx` |
| "Đăng lên cộng đồng" on the report form | `components/rescue-case/RescueCaseCreate.tsx` |
