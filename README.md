# VoiceHDK Bot

Discord temporary voice-room bot for Node.js 20+, discord.js v14 and PostgreSQL.

## Deploy

1. Copy `.env.example` to your environment configuration. Never commit the real token.
2. Set `DISCORD_TOKEN`, `DATABASE_URL`, and optionally `PORT`.
3. Install with `npm install` and run `npm start`.
4. On Render, use the repository start command `npm start` and attach PostgreSQL through `DATABASE_URL`.

Database migrations are idempotent and run during startup. Existing room data is preserved.

## Main commands

- `/setup` — install/reinstall the system.
- `/suapanel` — repair the two-message room panel.
- `/nhanphong` — claim an eligible room.
- `/kiemtra` — system diagnostics.
- `/datlai` — remove VoiceHDK Bot resources/data for the guild.
- `/theodoilog`, `/xoatheodoilog`, `/danhsachtheodoi` — opt-in external text channels for Log Chat.

Room chat is tracked automatically only for VoiceHDK-managed rooms. Unrelated channels are ignored unless explicitly opted in.
