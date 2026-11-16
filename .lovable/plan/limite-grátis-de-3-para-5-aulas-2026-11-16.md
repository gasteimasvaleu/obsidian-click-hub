# Limite grátis: de 3 para 5 aulas

Quem não assina passa a assistir 5 aulas inéditas de graça; a 6ª abre a tela de assinatura. Rever uma aula já vista continua sem gastar o limite.

## O que muda
- Regra no servidor: aceita registrar até 5 aulas grátis por pessoa (hoje trava em 3).
- Contador no app: limite 5 e "aulas restantes" calculado sobre 5.
- Textos: tela de login "Grátis para começar · 5 aulas liberadas" e tela de assinatura "Você assistiu suas 5 aulas grátis".
- Quem já usou as 3 aulas ganha mais 2 automaticamente.
- Memória do projeto atualizada (regra freemium = 5 aulas).

## Detalhes técnicos
- Nova migration: DROP/CREATE da policy "Users insert own free views" em public.free_lesson_views com `count(*) < 5`.
- src/hooks/useLessonAccess.ts: FREE_LESSON_LIMIT = 5.
- Paywall.tsx e Login.tsx: usar FREE_LESSON_LIMIT no texto.
- Teste em src/hooks: assert FREE_LESSON_LIMIT === 5.
