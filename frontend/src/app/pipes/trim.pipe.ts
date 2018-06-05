import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'trim'
})
export class TrimPipe implements PipeTransform {

  // Trims a string to the provided limit (default 50), or to the last full word it can find before the limit

  transform(text: string, limit = 50, fullWord: boolean = false): any {
    let out: string;

    if (text.length === 0) {
      out = '';
    } else if (text.length > limit) {
      const trimmedText = text.substr(0, limit);
      if (fullWord) {
        const lastSpace = trimmedText.lastIndexOf(' ');
        out = trimmedText.substr(0, Math.min(trimmedText.length, lastSpace !== -1 ? lastSpace : limit)) + '...';
      } else {
        out = trimmedText;
      }
    } else {
      out = text;
    }
    return out;
  }

}
