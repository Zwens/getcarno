import type { WuXing } from './wuxing'

export type MingLiLevel = '大吉' | '吉' | '半吉' | '凶' | '大凶'

export interface MingLi21Entry {
  number: number
  level: MingLiLevel
  wuxing: WuXing
  name: string
  description: string
  keyword: string
}

export const MING_LI_21: MingLi21Entry[] = [
  { number: 1, level: '大吉', wuxing: '木', name: '宇宙起源', keyword: '太极之数', description: '天地开泰，万事成就，一切充实，欣欣向荣。万物生发之象，利禄亨通，稳健踏实。' },
  { number: 2, level: '凶', wuxing: '木', name: '混沌未定', keyword: '分离破灭', description: '混沌不安，阴阳未定，壮志难酬，万事不如意。浮沉不定，难以安身。' },
  { number: 3, level: '大吉', wuxing: '火', name: '三才之数', keyword: '进取如意', description: '立身出世，有贵人助，天赐吉祥。名利双全，能成大事。' },
  { number: 4, level: '凶', wuxing: '火', name: '四象之数', keyword: '凶变不安', description: '日被云遮，苦难折磨，非有毅力，难望成功。破坏不安之象。' },
  { number: 5, level: '大吉', wuxing: '土', name: '福寿之数', keyword: '种竹成林', description: '阴阳和合，循环相生。福禄寿长，富贵荣华。安康和顺。' },
  { number: 6, level: '大吉', wuxing: '土', name: '安稳之数', keyword: '天德地祥', description: '天德地祥具备，福庆甚广。家势盛大，财运丰厚。安泰吉祥。' },
  { number: 7, level: '吉', wuxing: '金', name: '精悍之数', keyword: '刚毅果断', description: '精力旺盛，果决刚毅。独立权威，能成大业。但需注意包容。' },
  { number: 8, level: '吉', wuxing: '金', name: '坚刚之数', keyword: '意志刚健', description: '铁石心发，富于进取。排除万难，贯彻目的。坚忍不拔之象。' },
  { number: 9, level: '凶', wuxing: '水', name: '穷乏之数', keyword: '吉尽凶始', description: '穷乏困苦，利去功空。如能奋起精神，克服困难，也可成功。' },
  { number: 10, level: '大凶', wuxing: '水', name: '零暗之数', keyword: '万事终局', description: '万事终局充满损耗数，大凶大耗。如心态积极，或许可获一时安宁。' },
  { number: 11, level: '大吉', wuxing: '木', name: '旱苗逢雨', keyword: '万物更新', description: '万物更新，恢弘泽世。顺调发达，繁荣富贵。旺盛发展之象。' },
  { number: 12, level: '凶', wuxing: '木', name: '掘井无泉', keyword: '薄弱挫折', description: '意志薄弱，家庭寂寞。企图不顾薄弱之力做无能力之事。' },
  { number: 13, level: '大吉', wuxing: '火', name: '智略超群', keyword: '博学多才', description: '天赋学业，博学多才。善于谋略，忍柔当事，能成大业。' },
  { number: 14, level: '凶', wuxing: '火', name: '破兆之数', keyword: '家庭缘薄', description: '忍得苦难，必有后福。是成是败，惟靠坚毅。家庭缘薄。' },
  { number: 15, level: '大吉', wuxing: '土', name: '福寿圆满', keyword: '福寿拱照', description: '最大好运，福寿圆满之象。顺和、温良、雅量。上下敦睦。' },
  { number: 16, level: '大吉', wuxing: '土', name: '厚重载德', keyword: '贵人得助', description: '反凶化吉之象。得贵人相助，享天赋之福。能主持大局，功成名就。' },
  { number: 17, level: '半吉', wuxing: '金', name: '刚柔兼备', keyword: '权威刚强', description: '权威刚强，突破万难。有己无人，力量不济则反招灾。若能温和从事则吉。' },
  { number: 18, level: '大吉', wuxing: '金', name: '铁镜重磨', keyword: '有志竟成', description: '权威显达，博得名利。且养柔德，功成名就。内外合一。' },
  { number: 19, level: '凶', wuxing: '水', name: '多难之数', keyword: '风云蔽日', description: '有多智谋，成就一时名利。然每每生出意外灾害。内外生波澜。' },
  { number: 20, level: '凶', wuxing: '水', name: '屋下藏金', keyword: '非业破运', description: '非业破运之象。百事忧望。进退维谷，万事难全。' },
  { number: 21, level: '大吉', wuxing: '木', name: '明月中天', keyword: '独立权威', description: '风光霁月之象，万物确立。官运亨通，大搏名利。独立权威，能为首领。' },
]
