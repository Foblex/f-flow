export class GetNormalizedElementRectRequest {
    constructor(
        public element: HTMLElement | SVGElement,
        public isRoundedRect: boolean = true
    ) {
    }
}
