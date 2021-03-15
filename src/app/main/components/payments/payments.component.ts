import { Component, Inject, OnInit, Renderer2, ViewEncapsulation } from '@angular/core';
import { CourseInterface } from 'src/app/shared/interface/course.interface';
import { environment } from 'src/environments/environment';
import { MainService } from '../../main.service';
import { TaskService } from '../tasks/tasks.service';
import { DOCUMENT } from '@angular/common';
import { Checkout, PaymentsService } from './payments.service';
import { MatSnackBar } from '@angular/material/snack-bar';

interface WindowPayment extends Window {
  LiqPayCheckout: any;
}

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [PaymentsService, { provide: 'Window',  useValue: window }]
})
export class PaymentsComponent implements OnInit {
  public coursesList: CourseInterface[] = [];
  public paidCourses: Checkout[] = [];
  public selectedCourse: CourseInterface = null;
  public userInfo;
  public sign_string: string = '';
  public signature: string = '';

  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject('Window') private window: WindowPayment,
    private taskService: TaskService,
    private mainService: MainService,
    private renderer2: Renderer2,
    private paymentsService: PaymentsService,
    private snackBar: MatSnackBar
  ) {
    this.userInfo = mainService.userInfo;
    this.addScript();
   }

  ngOnInit() {
    this.taskService.getAllCourses().subscribe((courses: CourseInterface[]) => {
      this.coursesList = courses.filter((course: CourseInterface) => {
        return course.coachId === this.userInfo.coach.id || course.forAll && course.price;
      });
      this.paymentsService.getPaidCourses(this.userInfo.id).subscribe((paid: Checkout[]) => {
        this.paidCourses = paid;
        this.coursesList = this.coursesList.filter(course => {
          return paid.find((paid: Checkout) => paid.course.id === course.id || course.price > 0) || course.price > 0;
        });
      });
    });
    console.log(this);
  }

  public changeCourse(course: CourseInterface) {
    this.selectedCourse = course;
    this.preparePayment(course);

  }
  private preparePayment(course: CourseInterface) {
    const PAYMENT = {
      version: 3,
      env: environment.production ? true : false,
      action: "pay",
      amount: course.price,
      currency: "UAH",
      description: `Оплата курса ${course.name.toUpperCase()}`,
      order_id: this.userInfo.id + course.id
    };
    this.paymentsService.preparePayment(PAYMENT).subscribe((res: any) => {
      this.sign_string = res.data;
      this.signature = res.signature;
    });
  }

  public pay() {
    let self = this;
    this.window.LiqPayCheckout.init({
      data:this.sign_string,
      signature: this.signature,
      embedTo: "#liqpay_checkout",
      mode: "embed" // embed || popup,
        }).on("liqpay.callback", function(data){
      console.log(data.status);
      console.log(data);
      if(data.status === (environment.production ? 'wait_accept' : 'success')) {
        const CHECKOUT = {
          course: {
            id: self.selectedCourse.id,
            name: self.selectedCourse.name,
            description: self.selectedCourse.description.text
          },
          paid: true,
          price: self.selectedCourse.price,
          user: {
            id: self.userInfo.id,
            name: self.userInfo.userName,
            roleName: self.userInfo.role.name
          },
        };
        self.paymentsService.checkout(CHECKOUT).subscribe(res => {
          this.ngOnInit();
          this.snackBar.open('Курс успешно оплачен', '', {
            duration: 2000,
            panelClass: ['success']
          });
        })
      }
      }).on("liqpay.ready", function(data){
        console.log('ready', data);
        // ready
      }).on("liqpay.close", function(data){
        console.log('close', data);
        // close
    });
    // window.open(`https://www.liqpay.ua/api/3/checkout?data=${this.sign_string}&signature=${this.signature}`, "_blank");
  }

  private addScript() {
    const textScript = this.renderer2.createElement('script');
    textScript.src = '//static.liqpay.ua/libjs/checkout.js';
    this.renderer2.appendChild(this.document.body, textScript);

    const srcScript = this.renderer2.createElement('script');
    srcScript.type = 'text/javascript';
    srcScript.text = `
     !function(t,a){t.LiqPayCheckout=new function(){var e,n,i=t.encodeURIComponent,o={},r=(new Date).getTime().toString();this.init=function(t){var n=(t.host||"https://www.liqpay.ua/")+(t.language||"ru")+"/checkoutjs";for(var o in n+="?hostname="+i(location.hostname),n+="&port="+i(location.port),n+="&protocol="+i(location.protocol),n+="&uid="+r,t)n+="&"+i(o)+"="+i(t[o]);(e=a.createElement("iframe")).setAttribute("frameborder","0"),e.setAttribute("allowtransparency","true"),e.setAttribute("allowpaymentrequest","true"),e.setAttribute("scrolling","no"),e.setAttribute("style","width:100%;height:0px;background-color:transparent;"),e.setAttribute("src",n);try{"popup"==t.mode?this.popup(e):a.querySelector(t.embedTo||"body").appendChild(e)}catch(t){console.error(t)}return this},this.popup=function(t){(n=a.createElement("div")).innerHTML='<div id="liqpay_widget_popup_container" style="position: fixed !important;top: 0 !important;right: 0 !important;bottom: 0 !important;left: 0 !important;z-index: 3000 !important"><div id="liqpay_widget_popup_background" style="width: 100% !important;height: 100% !important;background: #000 !important;opacity: .4 !important"></div><div id="liqpay_widget_popup_iframe" style="-webkit-overflow-scrolling: touch !important; max-height: 100% !important; overflow: auto !important; position: absolute !important;\ttop: 50% !important;left: 50% !important;width: 385px !important;border-radius: 6px !important;\ttransform: translate(-50%, -50%) !important;-moz-transform: translate(-50%, -50%) !important;-ms-transform: translate(-50%, -50%) !important;-webkit-transform: translate(-50%, -50%) !important;-o-transform: translate(-50%, -50%) !important"></div></div>',a.querySelector("body").appendChild(n),a.querySelector("#liqpay_widget_popup_iframe").appendChild(t)},this.on=function(t,a){if("function"==typeof a)return t in o||(o[t]=[]),o[t].push(a),this},this.off=function(t,a){if(t in o){for(var e=[],n=0;n<o[t].length;n++)o[t][n]!=a&&e.push(o[t][n]);return o[t]=e,this}},this.call=function(t,a){if(t in o){for(var e=0;e<o[t].length;e++)o[t][e](a);return this}};var p=function(t,a){var n={cmd:t,params:a,uid:r},i=JSON.stringify(n);e.contentWindow.postMessage(i,"*")},s=function(t){if("object"!=typeof t.data)try{var a=JSON.parse(t.data);if(!a)return;if(a.uid!=r)return;var e=a.cmd||a.params.cmd;this.call(e,a.params),this.call("_",a.params)}catch(t){}}.bind(this);t.addEventListener?t.addEventListener("message",s,!1):t.attachEvent("onmessage",s),this.on("window.resize",function(t){e.style.height=t.height+"px"}),this.on("liqpay.close",function(){e.parentNode.removeChild(e),n&&n.parentNode.removeChild(n)});var c=void 0;this.on("applepay.canUse",function(a){t.ApplePaySession&&a.applepay_merchant_id&&t===t.parent?ApplePaySession.canMakePaymentsWithActiveCard(a.applepay_merchant_id).then(function(t){p("applepay.canUse",t?{canUse:!0}:{canUse:!1})}):p("applepay.canUse",{canUse:!1})}),this.on("applepay.begin",function(e){(c=new t.ApplePaySession(1,e.apple_data)).onvalidatemerchant=function(t){p("applepay.onvalidatemerchant",{validationURL:t.validationURL,domain:a.location.hostname})},c.onpaymentauthorized=function(t){p("applepay.onpaymentauthorized",{paymentData:t.payment.token.paymentData})}.bind(this),c.oncancel=function(t){p("applepay.oncancel",{})}.bind(this),c.begin()}),this.on("applepay.completeMerchantValidation",function(t){c.completeMerchantValidation(t.merchantSession)}),this.on("applepay.completePayment",function(t){c.completePayment(t.status)}),this.on("applepay.abort",function(){c.abort()})},t.LiqPayCheckoutCallback&&t.LiqPayCheckoutCallback()}(window,document);
    `;
    this.renderer2.appendChild(this.document.body, srcScript);
  }

  public youTubeGetID(url: any): string {
    url = url.split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
    return (url[2] !== undefined) ? url[2].split(/[^0-9a-z_\-]/i)[0] : url[0];
  }
}
