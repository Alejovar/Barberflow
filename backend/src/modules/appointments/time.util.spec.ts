import { addMinutesToTime, minutesToTime, rangesOverlap, timeToMinutes } from './time.util';

describe('time.util', () => {
  it('convierte HH:mm a minutos', () => {
    expect(timeToMinutes('09:00')).toBe(540);
    expect(timeToMinutes('00:00')).toBe(0);
    expect(timeToMinutes('23:45')).toBe(1425);
  });

  it('convierte minutos a HH:mm', () => {
    expect(minutesToTime(540)).toBe('09:00');
    expect(minutesToTime(0)).toBe('00:00');
  });

  it('suma minutos a un horario', () => {
    expect(addMinutesToTime('09:00', 30)).toBe('09:30');
    expect(addMinutesToTime('09:45', 30)).toBe('10:15');
  });

  it('detecta traslapes de rangos', () => {
    expect(rangesOverlap(540, 570, 550, 600)).toBe(true); // se traslapan
    expect(rangesOverlap(540, 570, 570, 600)).toBe(false); // contiguos, no traslapan
    expect(rangesOverlap(540, 570, 580, 600)).toBe(false); // separados
  });
});
