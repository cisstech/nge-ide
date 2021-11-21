export interface Preview {
    title: string;
    path: string;
    type: 'iframedoc' | 'html' | 'markdown';
    data: any;
}
