import * as dagre from 'dagre'
import { RenderTarget, renderDagre } from 'dagre-abstract-renderer'

/**
 * @public
 */
export function renderDagreToCanvas(graph: dagre.graphlib.Graph, canvas: HTMLCanvasElement, fontSize: number, margin: number) {
  renderDagre(graph, new CanvasTarget(canvas), fontSize, margin)
}

/**
 * @public
 */
export class CanvasTarget implements RenderTarget<void> {
  public ctx: CanvasRenderingContext2D
  constructor(public canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext('2d')!
  }
  measureText(text: string, fontSize: number, fontFamily: string) {
    this.ctx.textBaseline = 'middle'
    this.ctx.font = `${fontSize}px ${fontFamily}`
    const textMetrics = this.ctx.measureText(text)
    return textMetrics.width
  }
  getResult() {
    // do nothing
  }
  init(width: number, height: number) {
    this.canvas.width = width
    this.canvas.height = height
    this.ctx.fillStyle = 'white'
    this.ctx.fillRect(0, 0, width, height)
  }
  createNode(attributesAction: () => void, childrenAction: () => void) {
    this.ctx.save()
    attributesAction()
    childrenAction()
    this.ctx.restore()
  }
  strokeRect(x: number, y: number, width: number, height: number, color: string) {
    this.ctx.strokeStyle = color
    this.ctx.beginPath()
    this.ctx.strokeRect(x, y, width, height)
    this.ctx.stroke()
  }
  fillText(text: string, x: number, y: number, color: string, fontSize: number, fontFamily: string) {
    this.ctx.fillStyle = color
    this.ctx.textBaseline = 'middle'
    this.ctx.font = `${fontSize}px ${fontFamily}`
    const textMetrics = this.ctx.measureText(text)
    this.ctx.fillText(text, x - textMetrics.width / 2, y)
  }
  polyline(points: { x: number; y: number; }[], color: string) {
    this.ctx.strokeStyle = color
    this.ctx.beginPath()
    for (let i = 0; i < points.length; i++) {
      const point = points[i]
      if (i === 0) {
        this.ctx.moveTo(point.x, point.y)
      } else {
        this.ctx.lineTo(point.x, point.y)
      }
    }
    this.ctx.stroke()
  }
  polygon(points: { x: number; y: number; }[], color: string) {
    this.ctx.fillStyle = color
    this.ctx.beginPath()
    for (let i = 0; i < points.length; i++) {
      const point = points[i]
      if (i === 0) {
        this.ctx.moveTo(point.x, point.y)
      } else {
        this.ctx.lineTo(point.x, point.y)
      }
    }
    this.ctx.fill()
  }
}
