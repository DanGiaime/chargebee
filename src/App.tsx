import React, { Component } from "react";
import { RouteComponentProps } from "react-router";
import axios from "axios";
import { AuthenticatedTemplate, UnauthenticatedTemplate } from "@azure/msal-react";
import { MsalContext } from "@azure/msal-react";

let API_KEY = process.env.API_KEY;
let BACKEND_URL = "https://chargbee-backend.herokuapp.com";

axios.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded";
// axios.defaults.headers.post["Authorization"] = `Bearer ${API_KEY}`;

const MAX_PRICE = "250";

const urlEncode = function (data: any) {
  var str = [];
  for (var p in data) {
    if (
      data.hasOwnProperty(p) &&
      !(data[p] === undefined || data[p] === null)
    ) {
      str.push(
        encodeURIComponent(p) +
          "=" +
          (data[p] ? encodeURIComponent(data[p]) : "")
      );
    }
  }
  return str.join("&");
};

type State = {
  cbInstance: any;
  first_name: string;
  last_name: string;
  company: string;
  email: string;
  phone: string;
  loading: boolean;
  errorMsg: string;
  checked: boolean;
  contract_price: string;
  contract_name: string;
  contract_company: string;
  contract_date: string;
  step: string;
};

class CheckoutNew extends Component<RouteComponentProps<{}>, State> {
  static contextType = MsalContext;

  constructor(props: RouteComponentProps<{}>) {
    super(props);

    //@ts-ignore
    let planUrlParam =
      new URLSearchParams(this.props.location.search).get("token") || MAX_PRICE;
    let planAmount =
      planUrlParam === MAX_PRICE ? MAX_PRICE : atob(planUrlParam);

    this.state = {
      //@ts-ignore
      cbInstance: window.Chargebee.init({
        site: "payblepay",
      }),
      checked: false,
      first_name: "",
      last_name: "",
      company: "",
      email: "",
      phone: "",
      loading: false,
      errorMsg: "",
      plan: "flat-fee-" + planAmount,
      contract_price: planAmount,
      contract_name: "",
      contract_company: "",
      contract_date: new Date().toLocaleDateString(),
      step: "",
    } as State;

    this.handleCheckout = this.handleCheckout.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  generateContractHTML(overrideDisplay = false) {
    //@ts-ignore
    return (
      <div
        id="contract"
        style={overrideDisplay ? { display: "block" } : { display: "none" }}
      >
        <p id="contract-text">
          <br />
          <br />
          <strong>Delight Rewards Customer Agreement</strong>
          <br />
          <br />
          Important: Please read this Delight Rewards Customer Agreement
          carefull Should you have any questions concerning this Participation
          Agreement please contact Payble Inc, 222 W Merchandise Mart #1212,
          Chicago IL, 60654
          <br />
          <br />
          This Delight Rewards Customer Agreement ("Agreement") is entered into
          between {this.state.contract_company || "______________"}{" "}
          ("Participant") and Payble Inc ("Company"), and is effective as of the
          date of signature by the Participant.
          <br />
          <br />
          Functional Materials are defined herein as anything to do with the
          promotion or use of Payble, Inc.'s products and services.
          <br />
          <br />
          Participant wishes to obtain the benefit of Company's services at
          their places of business ("Participant Locations") and report as a
          customer of Company's products and services. The parties agree to the
          following terms and conditions:
          <br />
          <br />
          <strong>Company's Obligations</strong>
          <br />
          <br />
          Company shall provide the Participant with support for the creation
          and modification of offers Customer requires to have featured in
          Delight Rewards. Company shall provide Participant with usage data
          relevant to Participant's location, if required by Participant.
          Company shall provide Participant with marketing materials to display
          at Participant's location. Company reserves the license and copyright
          of the materials provided. If the Company chooses to build a new
          feature based on the participant's feedback, Company will provide
          weekly updates on the state of the new features.
          <br />
          <br />
          <strong>Participant's Obligations</strong>
          <br />
          <br />
          Participant agrees to report any flaws, errors or imperfections found
          in the Functional Materials. Participant agrees to complete all
          reasonable inquiries submitted to Participant by Company. Participant
          shall designate to Company, in writing, an employee or representative
          who will serve as the single technical contact and who will be
          responsible for maintaining communication with the Company. The
          Participant will maintain the confidentiality of Functional Materials
          with the same degree of care that you use to protect your own
          confidential and proprietary information
          <br />
          <br />
          <strong>Participant's Privacy Policy</strong>
          <br />
          <br />
          Participant agrees that any improvements, modifications and changes
          arising from or in connection with the Participant's usage of the
          Product, remain or become the exclusive property of the Company.
          Participant agrees that both the Company and the Participant have full
          ownership of any data collected by Delight Rewards while Agreement is
          in effect.
          <br />
          <br />
          <strong>Pricing</strong>
          <br />
          <br />
          Participant agrees to pay ${this.state.contract_price} per month until
          the termination of this contract by one or both of the parties.
          <br />
          <br />
          <strong>Terms and Termination</strong>
          <br />
          <br />
          This Agreement will be effective from the time the document is signed.
          Either party may terminate this Agreement at any time for any reason
          or no reason by providing the other party written notice at least two
          weeks in advance.
          <br />
          <br />
          <strong>Acceptance</strong>
          <br />
          <br />
          If you do not accept the terms and conditions of this Agreement, do
          not continue any further. By signing the Agreement, you are once again
          representing that: you wish to become a Customer of Payble, Inc; you
          have read this entire Agreement; you specifically agree to all of the
          above listed terms and conditions.
          <br />
          <br />
          Participant Signature:{" "}
          {this.state.contract_name
            ? this.state.contract_name
            : "_______________"}
          <br />
          <br />
          Company Representative Signature: Jacob Stevens
          <br />
          <br />
          Date: {this.state.contract_date}
        </p>
      </div>
    );
  }

  generateContractString(overrideDisplay = false) {
    return `<div id='contract' style=${
      overrideDisplay ? "{display:'block'}" : "{display:'none'}"
    }>
    <p id='contract-text'>
    <br/><br/>

    <strong>Delight Rewards Customer Agreement</strong>

    <br/><br/>
    Important: Please read this Delight Rewards Customer Agreement carefull 
    Should you have any questions concerning this Participation Agreement please contact
    Payble Inc, 222 W Merchandise Mart #1212, Chicago IL, 60654

    <br/><br/>
    This Delight Rewards Customer Agreement ("Agreement") is entered into between ${
      this.state.contract_company || "______________"
    } ("Participant") and Payble Inc ("Company"), and is effective as of the date of signature by the Participant.

    <br/><br/>
    Functional Materials are defined herein as anything to do with the promotion or use of Payble, Inc.'s products and services.

    <br/><br/>
    Participant wishes to obtain the benefit of Company's services at their places of business ("Participant Locations") and report as a customer of Company's products and services. The parties agree to the following terms and conditions:

    <br/><br/>
    <strong>Company's Obligations</strong>
    <br/><br/>
    Company shall provide the Participant with support for the creation and modification of offers Customer requires to have featured in Delight Rewards.
    Company shall provide Participant with usage data relevant to Participant's location, if required by Participant.
    Company shall provide Participant with marketing materials to display at Participant's location. Company reserves the license and copyright of the materials provided.
    If the Company chooses to build a new feature based on the participant's feedback, Company will provide weekly updates on the state of the new features.

    <br/><br/>
    <strong>Participant's Obligations</strong>
    <br/><br/>
    Participant agrees to report any flaws, errors or imperfections found in the Functional Materials. 
    Participant agrees to complete all reasonable inquiries submitted to Participant by Company.
    Participant shall designate to Company, in writing, an employee or representative who will serve as the single technical contact and who will be responsible for maintaining communication with the Company.
    The Participant will maintain the confidentiality of Functional Materials with the same degree of care that you use to protect your own confidential and proprietary information

    <br/><br/>
    <strong>Participant's Privacy Policy</strong>
    <br/><br/>
    Participant agrees that any improvements, modifications and changes arising from or in connection with the Participant's usage of the Product, remain or become the exclusive property of the Company.
    Participant agrees that both the Company and the Participant have full ownership of any data collected by Delight Rewards while Agreement is in effect.

    <br/><br/>
    <strong>Pricing</strong>
    <br/><br/>
    Participant agrees to pay $${
      this.state.contract_price
    } per month until the termination of this contract by one or both of the parties.
    <br/><br/>
    <strong>Terms and Termination</strong>
    <br/><br/>
    This Agreement will be effective from the time the document is signed. Either party may terminate this Agreement at any time for any reason or no reason by providing the other party written notice at least two weeks in advance.
    <br/><br/>
    <strong>Acceptance</strong>
    <br/><br/>
    If you do not accept the terms and conditions of this Agreement, do not continue any further. By signing the Agreement,  you are once again representing that:
    you wish to become a Customer of Payble, Inc;
    you have read this entire Agreement;
    you specifically agree to all of the above listed terms and conditions.


    <br/><br/>
    Participant Signature:    ${
      this.state.contract_name ? this.state.contract_name : "_______________"
    }
    
    <br/><br/>
    Company Representative Signature:          Jacob Stevens
    <br/><br/>
    Date: ${this.state.contract_date}

    </p>
  </div>`;
  }

  async handleCheckout(event: React.FormEvent) {
    const { checked, contract_company, contract_name } = this.state;
    if (checked && contract_company && contract_name) {
      this.sendEmail(this.generateContractString(true));
      this.setState({ loading: true });
      //@ts-ignore

      this.state.cbInstance.openCheckout({
        hostedPage: async () => {
          var data = {
            first_name: this.state.first_name,
            last_name: this.state.last_name,
            email: this.state.email,
            phone: this.state.phone,
            company: this.state.company,
            plan_id: "flat-fee-" + this.state.contract_price,
          };
          return axios
            .post(
              `${BACKEND_URL}/api/generate_checkout_new_url`,
              urlEncode(data)
            )
            .then((response) => response.data);
        },
        success(hostedPageId: number) {
          // console.log(hostedPageId);
        },
        close: () => {
          this.setState({ loading: false });
          if (this.state.step == "thankyou_screen") {
            window.location.href = "https://delightrewards.com/business.html";
          }
          // console.log("checkout new closed");
        },

        step: (step: string) => {
          this.setState({
            step: step,
          });
        },
      });
      event.preventDefault();
    } else {
      alert("Please fill in the fields to continue.");
    }
  }

  handleChange(event: any) {
    const target = event.target;
    const name = target.name;
    const value = target.type === "checkbox" ? target.checked : target.value;
    //console.log(target);
    //@ts-ignore
    this.setState({
      [name]: value,
    });
  }

  async sendEmail(email: string) {
    const headers = {
      "Content-type": "application/json",
      Authorization: `bearer ${API_KEY}`,
    };
    console.log(email);
    const res = await fetch(`${BACKEND_URL}/api/misc/paymentConfirmation`, {
      headers,
      method: "POST",
      body: JSON.stringify({ email: btoa(email) }),
    });
    return res.json();
  }

  render() {
    const { checked, contract_company, contract_name } = this.state;
    return (
      <div
        id="container"
        className="checkout container"
        style={{ padding: 30 }}
      >
        <div id="customer-info" className="row">
          <div className="col-lg-12" id="checkout_info">
            <form id="subscribe-form" onSubmit={this.handleCheckout}>
              <div className="page-header">
                <h3
                  style={{ fontSize: "2rem", marginBottom: 50, marginTop: 20 }}
                >
                  Delight Payments
                </h3>
              </div>
              <div className="row">
                <div className="col-sm-6">
                  <div className="form-group">
                    <label htmlFor="contract_company">Company</label>
                    <input
                      type="text"
                      name="contract_company"
                      placeholder="Awesome Company LLC"
                      className="form-control"
                      value={this.state.contract_company as string}
                      onChange={this.handleChange}
                      style={{ height: 50 }}
                    />
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="form-group">
                    <label htmlFor="contract_name">Name</label>
                    <input
                      type="text"
                      name="contract_name"
                      placeholder="John Smith"
                      className="form-control"
                      value={this.state.contract_name as string}
                      onChange={this.handleChange}
                      style={{ height: 50 }}
                    />
                  </div>
                </div>
              </div>
              {this.state.errorMsg && (
                <p className="text-danger">
                  There were errors while submitting
                </p>
              )}
              <div className="row" style={{ marginTop: 30 }}>
                <div className="col-xl-12">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      name="checked"
                      type="checkbox"
                      value=""
                      id="flexCheckDefault"
                      onChange={this.handleChange}
                    />
                    <label className="form-check-label">
                      I agree to the{" "}
                      <a
                        href="javascript:void(0);"
                        onClick={() => {
                          //@ts-ignore
                          document.querySelector("#contract").style.display =
                            "block";
                        }}
                      >
                        terms and conditions
                      </a>{" "}
                      of using Delight.
                    </label>
                  </div>
                </div>
              </div>
              <div
                className="form-inline"
                style={{ justifyContent: "center", marginTop: 20 }}
              >
                <div
                  className="form-gxroup"
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    marginBottom: 10,
                  }}
                >
                  {this.state.loading && (
                    <span ref="loader" className="subscribe-process process">
                      Processing&hellip;
                    </span>
                  )}
                </div>
                <div className="form-group">
                <AuthenticatedTemplate>
                  <input
                    type="submit"
                    className="submit-btn btn btn-success btn-lg"
                    value="Proceed to Payment"
                    style={{
                      backgroundColor:
                        checked && contract_company && contract_name
                          ? "#fe8520"
                          : "#cecece",
                      border: "none",
                      width: 250,
                    }}
                  />
            </AuthenticatedTemplate>
            <UnauthenticatedTemplate>
              <div onClick={() => this.context.instance.loginPopup()} >
                Help pls sign in
                </div>
            </UnauthenticatedTemplate>
                </div>
              </div>
            </form>
          </div>
          {this.generateContractHTML()}
          {/* <div className="col-sm-4 cb-order-list col-sm-offset-1">
              <div className="page-header">
                  <h3>Subscription Details</h3>
              </div>
              <div className="media">
                  <img src="/assets/images/plan.png" alt="Delight Payment" className="pull-left" />
                  <div className="media-body">
                    <p className="h4">Marvel classics</p>
                      <p className="h4">$9 <small><em>per month</em></small></p>
                  </div>
              </div>
          </div> */}
        </div>
      </div>
    );
  }
}

export default CheckoutNew;
