import type { Config } from "tailwindcss";
export default { content:["./app/**/*.{ts,tsx}","./components/**/*.{ts,tsx}"], theme:{extend:{colors:{forest:{50:"#f3f7f1",100:"#e3ecdf",500:"#3e6b45",700:"#24452c",900:"#152b1b"},clay:"#b7623f"},boxShadow:{soft:"0 12px 36px rgba(23,48,30,.10)"}}}, plugins:[] } satisfies Config;
