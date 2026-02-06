import { TestResult, ScaleKey, CalibrationPoints } from '@/types/oca';
import ocaTemplate from '@/assets/oca-template.jpg';

const defaultCalibration: CalibrationPoints = {
  top: 127,
  bottom: 596,
  left: 116,
  right: 1040,
};

export async function generateGraphImage(
  result: TestResult,
  calibration: CalibrationPoints = defaultCalibration
): Promise<string | null> {
  try {
    const baseW = 1156;
    const baseH = 842;
    const scale = 2;

    const canvas = document.createElement('canvas');
    canvas.width = Math.round(baseW * scale);
    canvas.height = Math.round(baseH * scale);
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('no_canvas');

    // Load background image
    const bgImg = new Image();
    await new Promise<void>((resolve, reject) => {
      bgImg.onload = () => resolve();
      bgImg.onerror = () => reject(new Error('bg_load_failed'));
      bgImg.src = ocaTemplate;
    });

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

    const graph = {
      left: calibration.left * scale,
      right: calibration.right * scale,
      top: calibration.top * scale,
      bottom: calibration.bottom * scale,
    };
    const graphWidth = graph.right - graph.left;
    const graphHeight = graph.bottom - graph.top;
    const scales: ScaleKey[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    const xStep = graphWidth / (scales.length - 1);

    const yScale = (value: number) => {
      const normalized = (100 - value) / 200;
      return graph.top + normalized * graphHeight;
    };

    // Draw line
    ctx.beginPath();
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3 * scale;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    scales.forEach((s, i) => {
      const x = graph.left + i * xStep;
      const y = yScale(result.percentiles[s]);
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // Draw points
    scales.forEach((s, i) => {
      const x = graph.left + i * xStep;
      const y = yScale(result.percentiles[s]);
      ctx.beginPath();
      ctx.fillStyle = '#000000';
      ctx.arc(x, y, 7 * scale, 0, Math.PI * 2);
      ctx.fill();
    });

    // Format date
    const formatDate = (date: Date | string) => {
      return new Date(date).toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    };

    // Title
    ctx.font = `bold ${24 * scale}px Arial, sans-serif`;
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'center';
    ctx.fillText('Результаты теста', (baseW * scale) / 2, 40 * scale);

    // Client info
    ctx.font = `${18 * scale}px Arial, sans-serif`;
    const infoText = `${result.clientInfo.name}   |   ${result.clientInfo.age} лет   |   ${formatDate(result.createdAt)}`;
    ctx.fillText(infoText, (baseW * scale) / 2, 75 * scale);

    // Scale values
    ctx.font = `bold ${16 * scale}px Arial, sans-serif`;
    const valuesLine = scales
      .map((s) => `${s}:${result.percentiles[s] > 0 ? '+' : ''}${result.percentiles[s]}`)
      .join('   ');
    ctx.fillText(valuesLine, (baseW * scale) / 2, 780 * scale);

    // Q22 and Q197
    const showQ22 = result.question22Answer === 'yes';
    const showQ197 = result.question197Answer === 'yes';
    if (showQ22 || showQ197) {
      ctx.font = `${14 * scale}px Arial, sans-serif`;
      ctx.fillStyle = '#333333';
      let qText = '';
      if (showQ22) qText += 'Q22: +';
      if (showQ22 && showQ197) qText += '   ';
      if (showQ197) qText += 'Q197: +';
      ctx.fillText(qText, (baseW * scale) / 2, 810 * scale);
    }

    // Convert to base64
    return canvas.toDataURL('image/jpeg', 0.9);
  } catch (error) {
    console.error('Error generating graph image:', error);
    return null;
  }
}
