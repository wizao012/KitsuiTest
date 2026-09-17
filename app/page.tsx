import {FAQ} from './faq';
import {ContactForm,InfoDialog} from './contact';
import {OriginalArtwork} from './original-artwork';
import sections from './original-sections.json';
function Copy({html}:{html:string}){return <div className="original-copy" dangerouslySetInnerHTML={{__html:html}}/>}
export default function Home(){return <><main className="lp-shell" id="top">
<OriginalArtwork html={sections.opening}/>
<section className="section faq" id="faq"><Copy html={sections.faqHead}/><FAQ/></section>
<section className="section form-section" id="area-form"><Copy html={sections.areaHead}/><ContactForm area/></section>
<section className="section apply-section" id="apply-form"><Copy html={sections.applyHead}/><ContactForm/></section>
<Copy html={sections.closing}/>
<footer className="site-footer"><a href="#top"><img src="/assets/logo-v5.webp" className="footer-logo" alt="フレッツ光クロスBIZ"/></a><p>フレッツ光クロスBIZ お申し込み窓口</p><div><InfoDialog kind="company"/><InfoDialog kind="privacy"/></div><small>デザイン確認版</small></footer>
</main><aside className="floating-cta" aria-label="お問い合わせメニュー"><a className="float-phone" href="tel:05017802661"><span className="phone-symbol" aria-hidden="true">☎</span><span>電話で相談</span></a><a className="float-area" href="#area-form">10Gエリアを確認</a></aside></>}