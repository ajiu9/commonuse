/**
 * @description Print using window.print via an iframe
 * @param {string} content - The content to be printed
 * @returns {void}
 */
export function windowPrint(content: string): void {
  let iframe = document.body.querySelector<HTMLIFrameElement>('#window-print')
  if (!iframe) {
    iframe = document.createElement('iframe')
    iframe.id = 'window-print'
    iframe.setAttribute('style', 'display:none;position:absolute;width:0px;height:0px;left:-500px;top:-500px;')
    document.body.appendChild(iframe)
  }
  const printDocument = iframe.contentWindow?.document
  if (printDocument) {
    printDocument.write(content)
    printDocument.close()
    iframe.contentWindow?.focus()
    // If there are images, they need to be loaded asynchronously, so execute in the next macro task
    setTimeout(() => {
      iframe.contentWindow?.print()
    }, 0)
  }
  else
    console.error('Failed to access iframe content window.')
}
