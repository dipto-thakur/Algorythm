export function driveId(url: string): string | null {
    const m =
      url.match(/\/file\/d\/([\w-]+)/) ??
      url.match(/[?&]id=([\w-]+)/);
  
    return m?.[1] ?? null;
  }
  
  export function driveLinks(url: string) {
    const id = driveId(url);
    if (!id) return null;
  
    return {
      preview: `https://drive.google.com/file/d/${id}/preview`,
      view: `https://drive.google.com/file/d/${id}/view`,
      download: `https://drive.google.com/uc?export=download&id=${id}`,
      image: `https://drive.google.com/thumbnail?id=${id}&sz=w1600`,
    };
  }