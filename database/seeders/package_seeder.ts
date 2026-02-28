import Package from '#models/package'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await Package.updateOrCreateMany('name', [
      {
        name: 'قص شعر',
        description: 'قص شعر احترافي يناسب شكل وجهك مع غسيل وتصفيف كامل',
        price: '80',
        duration: 30,
      },
      {
        name: 'حلاقة ذقن',
        description: 'حلاقة ذقن كلاسيكية بالموس مع فوطة ساخنة وبعد الحلاقة',
        price: '60',
        duration: 25,
      },
      {
        name: 'قص + ذقن',
        description: 'باقة كاملة تشمل قص الشعر وحلاقة الذقن بأفضل النتائج',
        price: '120',
        duration: 50,
      },
      {
        name: 'صبغة شعر',
        description: 'صبغة شعر احترافية بألوان متعددة مع حماية كاملة للشعر',
        price: '200',
        duration: 60,
      },
      {
        name: 'تنظيف بشرة',
        description: 'تنظيف عميق للبشرة مع ماسك مغذي وتقشير لطيف',
        price: '150',
        duration: 40,
      },
      {
        name: 'تصفيف شعر',
        description: 'تصفيف شعر فاخر باستخدام أفضل منتجات العناية العالمية',
        price: '50',
        duration: 20,
      },
      {
        name: 'باقة العريس',
        description: 'باقة شاملة للعريس: قص شعر، حلاقة ذقن، تنظيف بشرة، وتصفيف',
        price: '350',
        duration: 90,
      },
      {
        name: 'حمام زيت',
        description: 'حمام زيت مغذي للشعر مع تدليك فروة الرأس لتقوية الشعر',
        price: '100',
        duration: 35,
      },
    ])
  }
}