import { Directive, ElementRef, Renderer2, Input, HostListener, OnChanges } from "@angular/core";


@Directive({
    selector: "[studClass]"
})
export class StudClassDirective implements OnChanges{
    @Input() studFlags: boolean[]  = [];
    @Input() markCheck: boolean = true;

    constructor(public renderer: Renderer2, public el: ElementRef){
    }

    ngOnChanges(): void {
        // выделение по среднему баллу
        if (this.studFlags[0]){
            if (this.markCheck){
                this.renderer.addClass(this.el.nativeElement, "badMark");
            } else {
                this.renderer.removeClass(this.el.nativeElement, "badMark");
            }
        }
        // студент найден
        if (this.studFlags[1]){
            this.renderer.addClass(this.el.nativeElement, "findST");
        } else {
            this.renderer.removeClass(this.el.nativeElement, "findST");
        }
        // студент в процессе удаления или редактирования
        if (this.studFlags[2] || this.studFlags[3] ){
            this.renderer.addClass(this.el.nativeElement, "inProc");
        } else if (!this.studFlags[2] && !this.studFlags[3]) {
            this.renderer.removeClass(this.el.nativeElement, "inProc");
        }
    }

    @HostListener("mouseenter") onMouseEnter(): void{
        this.renderer.addClass(this.el.nativeElement, "focusNow");
    }
    @HostListener("mouseleave") onMouseLeave(): void{
        this.renderer.removeClass(this.el.nativeElement, "focusNow");
    }
}

@Directive({
    selector: "[animDiv]"
})
export class AnimDivDirective{
    public today: Date = new Date();

    constructor(public renderer: Renderer2, public el: ElementRef){
    }

    @HostListener("mouseenter") onMouseEnter(): void {
        this.renderer.addClass(this.el.nativeElement, "animDiv");
    }
    @HostListener("mouseleave") onMouseLeave(): void{
        this.renderer.removeClass(this.el.nativeElement, "animDiv");
    }
}

