export function formatDate(timestamp) {
  const d = new Date(+timestamp);
  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const date = d.getDate().toString().padStart(2, '0');

  const hour = d.getHours().toString().padStart(2, '0');
  const minute = d.getMinutes().toString().padStart(2, '0');
  const second = d.getSeconds().toString().padStart(2, '0');
  const day = d.getDay();
  const weekDayArr = ['日', '一', '二', '三', '四', '五', '六'];
  const weekDay = weekDayArr[day];
  return `${year}-${month}-${date} ${hour}:${minute}:${second} 星期${weekDay}`;
}
