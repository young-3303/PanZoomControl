import type {Options} from "./types";

class PanZoomControl {
  scale: number;
  translate: { x: number; y: number };
  element: HTMLElement;
  container: HTMLElement | undefined;
  start: { x: number; y: number };
  static dragging: boolean;
  maximum: number = 0
  minimum: number = 0
  deltaScale: number = 0
  constructor(options: Options) {
    this.element = options.scaleElement;
    this.container = options.container
    this.maximum = options.maximum
    this.minimum = options.minimum
    this.deltaScale = options.deltaScale || 0.1
    this.scale = 1;
    this.translate = { x: 0, y: 0 };
    this.start = { x: 0, y: 0 };
    PanZoomControl.dragging = false;
    this.element.style.cursor = 'grabbing'
    // 绑定事件
    this.bindEvents();
  }

  private bindEvents(): void {
    this.element.addEventListener('wheel', this.handleWheel);
    this.element.addEventListener('mousedown', this.handleMouseDown);
    this.element.addEventListener('mouseleave', this.handleMouseUp)
    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('mouseup', this.handleMouseUp);
  }
  private handleWheel = (event: WheelEvent): void => {
    event.preventDefault()
    const rect = this.element.getBoundingClientRect();
    const deltaScale = (event.deltaY > 0 ? -1 : 1) * this.deltaScale;
    // const newScale = Math.min(Math.max(this.scale * deltaScale, this.minimum), this.maximum);
    const newScale = Math.min(Math.max(this.scale + deltaScale, this.minimum), this.maximum);
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const newOriginX = (mouseX / this.scale) - mouseX / newScale;
    const newOriginY = (mouseY / this.scale) - mouseY / newScale;

    this.translate.x = this.translate.x - newOriginX * newScale;
    this.translate.y = this.translate.y - newOriginY * newScale;
    this.scale = newScale;

    this.updateTransform();
  };

  private handleMouseDown = (event: MouseEvent): void => {
    this.start.x = event.clientX - this.translate.x;
    this.start.y = event.clientY - this.translate.y;
    PanZoomControl.dragging = true;
  };

  private handleMouseMove = (event: MouseEvent): void => {
    event.preventDefault()
    if (!PanZoomControl.dragging) return;
    this.translate.x = event.clientX - this.start.x;
    this.translate.y = event.clientY - this.start.y;
    this.updateTransform();
  };

  private handleMouseUp = (): void => {
    PanZoomControl.dragging = false;
  };

  private updateTransform(): void {
    this.element.style.transform = `translate(${this.translate.x}px, ${this.translate.y}px) scale(${this.scale})`;
    this.element.style.transformOrigin = '0 0'
  }

  public destroy(): void {
    this.element.removeEventListener('wheel', this.handleWheel);
    this.element.removeEventListener('mousedown', this.handleMouseDown);
    this.element.removeEventListener('mouseleave', this.handleMouseUp)
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseup', this.handleMouseUp);
  }
}

export default PanZoomControl
