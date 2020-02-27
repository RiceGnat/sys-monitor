const gb = ['', 'K', 'M', 'G', 'T']
export const geebees = (bytes, {
    decimals = 0,
    unit = 'B',
    offset = 0,
    byteMode = true
} = {}) => {
    const d = Number.isInteger(decimals) ? decimals : 0;
    const u = unit || 'B';
    let b = bytes;
    let n = 0;
    while (b > 1000) {
        b /= byteMode ? 1024 : 1000;
        n++;
    }
    return `${b.toFixed(d)} ${gb[n + offset]}${u}`;
}

export const cardDrag = (e, callback) => {
    if (e.dataTransfer.types.includes('card')) {
        
    }
}