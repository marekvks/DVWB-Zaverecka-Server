# Jak na spuštění projektu
1. Stáhnutí repozitáře

```bash
git clone https://github.com/marekvks/DVWB-Zaverecka-Server.git
```

2. Po otevření je potřeba spustit v obou souborech příkaz:
```bash
npm i
```
Tento příkaz nám nainstaluje všechny dependence, které jsou potřeba ke spuštění serveru.

3. Nyní je potřeba stáhnout schéma databáze
```bash
npx prisma db pull
```
a následně 
```bash
npx prisma generate
```
Tímto krokem nám bude komunikace s databází fungovat správně

4. Nyní už stačí jen soubory spustit a to uděláme následujícím příkazem:
```bash
npm run dev
# nebo
yarn dev
# nebo
pnpm dev
# nebo
bun dev
```
