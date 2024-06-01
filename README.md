# Jak spustit projekt
1. Nejprve je potřeba si stáhnout jak sevrery (tento repozitář), tak clien. Odkaz naleznete zde [DVWB-Zaverecka-Client](https://github.com/marekvks/DVWB-Zaverecka-Client).

2. Po otevření je potřeba spustit v obou souborech příkaz:
```bash
npm i
```
Tento příkaz nám nainstaluje všechny balíčky co budeme potřebovat.

3. Nyní je potřeba spustit příkaz (pouze v souboru DVWB-Zaverecka-Server)
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
5. Otevřete Váš webový prohlížeč a přejděte na [http://localhost:3000](http://localhost:3000).
