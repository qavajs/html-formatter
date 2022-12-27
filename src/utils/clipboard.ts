function clipboard(data: string): (e?: any) => Promise<void> {
    return function (event: Event): Promise<void> {
        event.stopPropagation();
        return navigator.clipboard.writeText(data);
    }
}

export default clipboard;
