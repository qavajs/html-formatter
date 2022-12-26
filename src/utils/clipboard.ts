function clipboard(data: string): Function {
    return function (event: Event): Promise<void> {
        event.stopPropagation();
        return navigator.clipboard.writeText(data);
    }
}

export default clipboard;
