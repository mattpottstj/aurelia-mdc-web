import { MdcComponent, MdcFocusTrap } from '@aurelia-mdc-web/base';
import { CloseReason, events, MDCBannerAdapter, MDCBannerCloseEventDetail, MDCBannerFoundation } from '@material/banner';
import { inject } from 'aurelia-dependency-injection';
import { PLATFORM } from 'aurelia-pal';
import { customElement, useView } from 'aurelia-templating';
import { bindable } from 'aurelia-typed-observable-plugin';

events.CLOSED = events.CLOSED.toLowerCase();
events.CLOSING = events.CLOSING.toLowerCase();
events.OPENED = events.OPENED.toLowerCase();
events.OPENING = events.OPENING.toLowerCase();

/**
 * @selector mdc-banner
 */
@inject(Element)
@useView(PLATFORM.moduleName('./mdc-banner.html'))
@customElement('mdc-banner')
export class MdcBanner extends MdcComponent<MDCBannerFoundation> {

  private contentEl: HTMLElement;
  private mdcFocusTrap: MdcFocusTrap;

  @bindable.booleanAttr
  fixed: boolean;

  @bindable.booleanAttr
  centered: boolean;

  @bindable
  icon: string;

  @bindable
  primaryAction: string;

  @bindable
  secondaryAction: string;

  handlePrimaryActionClick() {
    this.foundation?.handlePrimaryActionClick();
  }

  handleSecondaryActionClick() {
    this.foundation?.handleSecondaryActionClick();
  }

  /**
   * Opens the banner and fires events.OPENING to indicate the beginning of its
   * opening animation and then events.OPENED once the animation finishes.
   */
  open() {
    this.foundation?.open();
  }

  /**
   * Closes the banner and fires events.CLOSING to indicate the beginning of its
   * closing animation and then events.CLOSED once the animation finishes.
   * @param reason Why the banner was closed. Value will be passed to
   *     events.CLOSING and events.CLOSED via the `event.detail.reason`
   *     property. Standard values are CloseReason.PRIMARY and
   *     CloseReason.SECONDARY, but CloseReason.UNSPECIFIED is provided for
   *     custom handling of programmatic closing of the banner.
   */
  close(reason: CloseReason) {
    this.foundation?.close(reason);
  }

  getDefaultFoundation() {
    // DO NOT INLINE this variable. For backward compatibility, foundations take
    // a Partial<MDCFooAdapter>. To ensure we don't accidentally omit any
    // methods, we need a separate, strongly typed adapter variable.
    const adapter: MDCBannerAdapter = {
      addClass: (className) => {
        this.root.classList.add(className);
      },
      getContentHeight: () => {
        return this.contentEl.offsetHeight;
      },
      notifyClosed: (reason) => {
        this.emit<MDCBannerCloseEventDetail>(events.CLOSED, { reason });
      },
      notifyClosing: (reason) => {
        this.emit<MDCBannerCloseEventDetail>(events.CLOSING, { reason });
      },
      notifyOpened: () => {
        this.emit(events.OPENED, {});
      },
      notifyOpening: () => {
        this.emit(events.OPENING, {});
      },
      releaseFocus: () => {
        this.mdcFocusTrap?.releaseFocus();
      },
      removeClass: (className) => {
        this.root.classList.remove(className);
      },
      setStyleProperty: (propertyName, value) => {
        this.root.style.setProperty(propertyName, value);
      },
      trapFocus: () => {
        this.mdcFocusTrap?.trapFocus();
      },
    };
    return new MDCBannerFoundation(adapter);
  }

}
