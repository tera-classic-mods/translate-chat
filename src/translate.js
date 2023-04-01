const request = require('node-fetch');
const { normalize } = require('./normalize');
const LanguageDetect = require('../lib/language-detector');
const lngDetector = new LanguageDetect();
lngDetector.setLanguageType('iso2');

module.exports.AVAILABLE_LANGUAGES = ['af', 'sq', 'ar', 'az', 'eu', 'bn', 'be', 'bg', 'ca', 'zh-CN', 'zh-TW', 'hr', 'cs', 'da', 'nl', 'en', 'eo', 'et', 'tl', 'fi', 'fr', 'gl', 'ka', 'de', 'el', 'gu', 'ht', 'iw', 'hi', 'hu', 'is', 'id', 'ga', 'it', 'ja', 'kn', 'ko', 'la', 'lv', 'lt', 'mk', 'ms', 'mt', 'no', 'fa', 'pl', 'pt', 'ro', 'ru', 'sr', 'sk', 'sl', 'es', 'sw', 'sv', 'ta', 'te', 'th', 'tr', 'uk', 'ur', 'vi', 'cy', 'yi', 'any'];

async function translate(text, translateTo, translateFrom = 'auto') {
  const detectedLanguage = lngDetector.detect(text, 1);
  if (detectedLanguage[0] && detectedLanguage[0][0] === translateTo) return text;

  // Stolen from  https://github.com/statickidz/node-google-translate-skidz
  const url = 'https://translate.google.com/translate_a/single'
    + '?client=at&dt=t&dt=ld&dt=qca&dt=rm&dt=bd&dj=1&hl=' + translateTo + '&ie=UTF-8'
    + '&oe=UTF-8&inputm=2&otf=2&iid=1dd3b944-fa62-4b55-b330-74909a99969e';

  const params = new URLSearchParams();
  params.append('sl', translateFrom);
  params.append('tl', translateTo);
  params.append('q', text);

  const response = await request(url, {
    method: 'post',
    body: params,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      'User-Agent': 'AndroidTranslate/5.3.0.RC02.130475354-53000263 5.1 phone TRANSLATE_OPM5_TEST_1',
    },
  });
  const body = await response.text();
  try {
    const jsonBody = JSON.parse(body);
    return `${jsonBody.sentences[0].trans}`;
  } catch (e) {
  }
}

module.exports.translate = translate;

const normalizeNa = (str) => {
  return normalize(str)
    .replace(/[^\x00-\x7F]/g, '')
    .replace(/\s+$/, '');
};
module.exports.normalizeNa = normalizeNa;
