function clipboard(data: string) {
    return function (event: Event) {
        event.stopPropagation();
        return navigator.clipboard.writeText(data);
    }
}

export default clipboard;
