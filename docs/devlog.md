1. Setup projektu, server i klient
2. lokální autentifikace, login přes heslo (bez databáze)
3. integrace databáze přes prismu
4. návrh databáze, setup dokumentace
5. endpointy pro blogposty
6. validace emailu přes email-validator, šifrování refresh tokenu, ukládání refresh tokenu v databázi, dokumentace autentifikace
7. posílání access a refresh tokenu přes cookies, nastavení .env.template
8. získávání uživatele
9. updatování uživatele
10. upravování chyb v registraci
11. rework autentifikace - nestorování refresh tokenu v databázi, refresh token vyprší za 30 dní, 7 dní předtím se obnoví
12. přepsání cookies tokenů, když se uživatel odhlásí
13. příprava nodemaileru, test posílání emailů
14. posílání kódu k obnovení hesla, kontrolování kódu
15. měnění zapomenutého hesla
16. obecný middleware pro změnu hesla
17. přidání endpointu blogPost/:id, opravení, že blogPost nevrací array
18. úprava avataru přes multer
19. endpointy pro komentáře - získání všech komentářů u postu, vytvoření komentáře
20. validace komentářů
21. validace blogpostů + příprava pro likování postů
22. follow uživatelů, validace followů
23. opravování errorů, polish
24. dokumentace