
  import { punjabiMappings } from './src/lib/fonts/punjabi-mappings';
  
  const text = "ਵੈਨੇਜ਼ੁਏਲਾ 'ਚ ਭੂਚਾਲ : ਮ੍ਰਿਤਕਾਂ ਦੀ ਗਿਣਤੀ 6,100 ਤੋਂ ਪਾਰ, ਅਮਰੀਕਾ ਨੇ ਮੁੜ ਸ਼ੁਰੂ ਕੀਤੀਆਂ 'ਡਿਪੋਟੇਸ਼ਨ ਫਲਾਈਟਾਂ ";
  let out = text;
  
  for (const [regex, replacement] of punjabiMappings.anmollipi.fromUnicode) {
    const search = typeof regex === "string" ? new RegExp(regex, "g") : regex;
    out = out.replace(search, replacement);
  }
  
  console.log("OUR RESULT:", out);
