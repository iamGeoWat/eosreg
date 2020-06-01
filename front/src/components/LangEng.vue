<template>
    <div id="app">
        <el-main>
            <el-row justify="center" type="flex">
                <el-card class="body-card" type="flex">
                    <el-switch style="float: right;" @change="switchLang()" v-model="langSelect" inactive-text="中文" active-text="English" active-color="#409EFF" inactive-color="#409EFF"/>
                    <div style="margin-top: 30px;">
                        <span class="h1">EOS Account Creation Service</span>
                    </div>
                    <h3>Real-time Pricing, Pay with Cryptocurrency.</h3>
                    <hr>
                    <div>The creation of a new EOS account requires someone to spend some EOS token on the creation action. The token is paid for RAM, Network and CPU resource used by a new account. If you create your account with our service, a new account will be possessing 4KB RAM and 0.2 EOS staked for Network and CPU. Only 10% fee is needed ( Others usually require 20% ).</div>
                    <br>
                    <el-card class="input-card">
                        <el-row type="flex" justify="space-between">
                            <el-col :xs="1" :sm="2" :md="2" :lg="2" :xl="2"><span>&nbsp;</span></el-col>
                            <el-col :xs="22" :sm="8" :md="8" :lg="8" :xl="8"><el-input @change="paramChanged()" placeholder="Account Name" v-model="accountName"/></el-col>
                            <el-col :xs="1" :sm="2" :md="2" :lg="2" :xl="2"><span>&nbsp;</span></el-col>
                        </el-row>
                        <div class="hint-label">*Exact 12 characters, use only LOWER CASE letters and 1 2 3 4 5</div>
                        <br>
                        <el-row type="flex" justify="space-between">
                            <el-col :xs="1" :sm="2" :md="2" :lg="2" :xl="2"><span>&nbsp;</span></el-col>
                            <el-col :xs="22" :sm="12" :md="12" :lg="12" :xl="12"><el-input @change="paramChanged()" placeholder="Owner Public Key" v-model="ownerPubKey"/></el-col>
                            <el-col :xs="1" :sm="2" :md="2" :lg="2" :xl="2"><span>&nbsp;</span></el-col>
                        </el-row>
                        <el-row type="flex" justify="space-between" style="margin-top: 2px">
                            <el-col :xs="1" :sm="2" :md="2" :lg="2" :xl="2"><span>&nbsp;</span></el-col>
                            <el-col :xs="22" :sm="12" :md="12" :lg="12" :xl="12"><el-input @change="paramChanged()" placeholder="Active Public Key" v-model="activePubKey"/></el-col>
                            <el-col :xs="1" :sm="2" :md="2" :lg="2" :xl="2"><span>&nbsp;</span></el-col>
                        </el-row>
                        <div class="hint-label">*Above two can be the same</div>
                        <el-row type="flex" justify="space-between" style="margin-top: 18px">
                            <el-col :xs="1" :sm="2" :md="2" :lg="2" :xl="2"><span>&nbsp;</span></el-col>
                            <el-col :xs="22" :sm="8" :md="8" :lg="8" :xl="8"><el-input placeholder="E-mail Addreess" v-model="customerEmail"/></el-col>
                            <el-col :xs="1" :sm="2" :md="2" :lg="2" :xl="2"><span>&nbsp;</span></el-col>
                        </el-row>

                        <div class="hint-label">*Only for communication when error occurs, can be empty</div>
                        <el-button type="default" style="margin-top: 10px" @click="checkAccount()">Check Availability</el-button>
                        <el-button type="primary" style="margin-top: 10px" @click="goCreate()" :disabled="shallNotPass">Pay to Create!</el-button>
                        <div class="hint-label">*After click, please wait for Pop-up payment window to load</div>


                        <el-dialog width="90%" title="Confirm Purchase" :visible.sync="dialogVisible">
                            <el-row justify="center" type="flex">
                                <el-collapse accordion style="width: 90%">
                                    <el-collapse-item title="Please read and agree EOS Constitution">
                                        <el-checkbox style="margin-top: 10px" v-model="agreeEOS" @change="checkAgree()">I have read and agree <a target="_Blank" href="https://github.com/EOS-Mainnet/governance/blob/master/eosio.system/eosio.system-clause-constitution-rc.md">EOS Constitution</a></el-checkbox>
                                    </el-collapse-item>
                                    <el-collapse-item title="Please read and agree User Agreement">
                                        <div>
                                            <h1>User Agreement</h1>
                                            <h2>Cookies</h2>
                                            <p>This site requires cookies for the purchasing of accounts functionality. This site uses signed cookies which means no session information is stored on our server.</p>
                                            <h2>Which information is stored?</h2>
                                            <p>For privacy reasons, we store no personal information from the user like name, email address, residency and such. When the user purchases an account, we only store the desired account name and public key that the user entered. We require this data to being able to create the EOS account. After the account has been created, this data will enter the EOS blockchain and become public record.
                                            </p>
                                            <h2>Payment</h2>
                                            <p>When the user pays with any of the supported cryptocurrencies, there will be a pseudonymous
                                                public record of that purchase in the respective blockchain.
                                            </p>
                                        </div>
                                        <el-checkbox v-model="agreeUA" @change="checkAgree()">I have read and agree User Agreement</el-checkbox>
                                    </el-collapse-item>
                                </el-collapse>
                            </el-row>
                            <div style="margin-top: 10px">
                                <el-button style="width: 70%" type="primary" :disabled="agreedAll"
                                           @click="goPay()">
                                    <span>Pay with Cryptocurrency</span>
                                </el-button>
                            </div>
                        </el-dialog>
                    </el-card>
                </el-card>
            </el-row>

            <el-row justify="center" type="flex" style="margin-top: 10px">
                <el-card class="body-card">
                    <div style="margin-top: 20px; margin-bottom: 10px">
                        <span class="h1">Order History</span>
                        <el-button type="medium" style="float: right;" @click="refreshHistory()"><i class="el-icon-refresh"></i></el-button>
                    </div>
                    <el-table :data="historyDataTranslated" stripe style="width: 100%">
                        <el-table-column prop="txid" label="Payment ID"/>
                        <el-table-column prop="account_name" label="Account Name"/>
                        <el-table-column prop="pay_status" label="Payment Progress"/>
                        <el-table-column prop="reg_status" label="Creation Progress"/>
                    </el-table>
                </el-card>
            </el-row>

            <el-row justify="center" type="flex" style="margin-top: 10px">
                <el-card class="body-card">
                    <div style="margin-top: 20px; margin-bottom: 10px">
                        <span class="h1">FAQ</span>
                    </div>
                    <h3>What is Active / Owner Public Key ?</h3>
                    <p>The owner of Active Public Key is able to use functions of the account, while the owner of Owner Public Key obtains the actual ownership.</p>
                    <h3>I Have Paid but No Account Created / How to Contact You?</h3>
                    <p>If you have any problem, contact realgeowat@gmail.com, Or join our <a href="https://t.me/joinchat/GUzUNA-IhCx-TW3k7MOw0g" target="_blank">Telegram Group</a>. No worry, every operation is recorded on our database.</p>
                    <h3>How Do You Calculate the Price?</h3>
                    <p>Price formula: <br>[( 4KB RAM * Price of 1KB RAM ）+ 0.1 EOS staked for CPU + 0.1 EOS staked for Network + 0.2 EOS RAM transfer fee ] * Real-time Bitfinex EOS/USDT Price + 10% Service Fee ( for our cash flow )<br><br></p>
                    <h3>Is Your Service Safe?</h3>
                    <p>Safe. We don't require your Private Key through the whole process. And we are open-source on <a href="https://github.com/iamGeoWat/eosreg" target="_blank">Github</a>.</p>
                    <h3>EOS Account Structure</h3>
                    <p>A EOS account belongs to a certain keypair, a keypair is able to store multiple accounts. Controlling the private key means controlling the accounts.</p>
                    <h3>How to Generate Keypairs?</h3>
                    <p>Due to security concerns, we don't provide the Keypair generation service. You must make sure your private key is only controlled by you.<br>We recommend using <a href="https://get-scatter.com/" target="_blank">Scatter</a>, an open-source Chrome plugin developed by trusted EOSNewYork to generate and manage Keypairs.<br>You can also use other wallet apps you trust.</p>
                </el-card>
            </el-row>
        </el-main>
    </div>
</template>

<script>
  import EOS from 'eosjs';
  import ElCard from "element-ui/packages/card/src/main";
  import ElRow from "element-ui/packages/row/src/row";
  const EOS_CONFIG = {
    clientConfig: {
      httpEndpoint: 'https://fullnode.meet.one', // EOS http endpoint
      chainId: 'cfe6486a83bad4962f232d48003b1824ab5665c36778141034d75e57b956e422'
    }
  };

  function EOSClient() {
    return EOS(EOS_CONFIG.clientConfig);
  }

  let eos = EOSClient();

  export default {
    mounted: function () {
      this.refreshHistory();
    },
    name: 'LangEng',
    data() {
      return {
        accountName: '',
        ownerPubKey: '',
        activePubKey: '',
        opkOK: false,
        apkOK: false,
        shallNotPass: true,
        dialogVisible: false,
        agreedAll: true,
        agreeEOS: false,
        agreeUA: false,
        customerEmail: '',
        historyData: [],
        historyDataTranslated: [],
        langSelect: true
      }
    },
    components: {
      ElRow,
      ElCard
    },
    methods: {
      switchLang () {
        this.$emit("switch-lang")
      },
      paramChanged () {
        this.shallNotPass = true;
      },
      translateHistory () {
        if (!this.langSelect) {
          if (this.historyData !== undefined) {
            this.historyDataTranslated = this.historyData;
            for (var i = 0; i < this.historyData.length; i++) {
              if (this.historyData[i].pay_status === 'ispaid') {
                this.historyDataTranslated[i].pay_status = '已付款';
              } else {
                this.historyDataTranslated[i].pay_status = '未付款';
              }
              if (this.historyData[i].reg_status === 'regdone') {
                this.historyDataTranslated[i].reg_status = '注册完成';
              } else {
                this.historyDataTranslated[i].reg_status = '未开始';
              }
            }
          }
        } else {
          if (this.historyData !== undefined) {
            this.historyDataTranslated = this.historyData;
            for (var i = 0; i < this.historyData.length; i++) {
              if (this.historyData[i].pay_status === 'ispaid') {
                this.historyDataTranslated[i].pay_status = 'Payment Received';
              } else {
                this.historyDataTranslated[i].pay_status = 'Payment Not Received';
              }
              if (this.historyData[i].reg_status === 'regdone') {
                this.historyDataTranslated[i].reg_status = 'Creation Finish';
              } else {
                this.historyDataTranslated[i].reg_status = 'Not Started';
              }
            }
          }
        }
      },
      refreshHistory () {
        this.$http.post('/refreshHistory', {

        }).then((res) => {
          console.log(res.body);
          this.historyData = res.body.history;
          console.log('history refreshed.');
          this.translateHistory();
        })
      },
      goPay () {
        let tempWindow = window.open('');

        eos.getTableRows({"json":"true","code":"eosio","scope":"eosio","table":"rammarket","limit":"10"}).then((data) => {
          let connectorBalance = data.rows[0].quote.balance.substr(0, data.rows[0].quote.balance.lastIndexOf(" "));
          let smartTokenOutstandingSupply = data.rows[0].base.balance.substr(0, data.rows[0].base.balance.lastIndexOf(" "));
          let connectorWeight = data.rows[0].quote.weight;
          let ramPriceinKB = connectorBalance / ( smartTokenOutstandingSupply * connectorWeight ) * 1024 * 0.5;
          console.log(ramPriceinKB);
          let ramPrice = ramPriceinKB * 4 + 0.2 + 0.2; //ram fee 0.2, cpu 0.1, net 0.1
          console.log(ramPrice);
          this.$http.get('https://api-pub.bitfinex.com/v2/ticker/tEOSUSD').then((res) => { //todo: refactor with axios
            let eosPrice = res.body[6];
            console.log(eosPrice);
            let orderPrice = (ramPrice * eosPrice) * 1.15; //try 15% fee
            console.log(orderPrice);
            if (!this.langSelect) {
              this.$http.post("https://api.commerce.coinbase.com/charges", {
                "name": "EOS 账号创建服务",
                "description": "4Kb Ram 用以账号注册，0.2 EOS 作为 CPU/网络 质押",
                "local_price": {
                  "amount": orderPrice,
                  "currency": "USD"
                },
                "pricing_type": "fixed_price",
                "metadata": {
                  // "customer_id": "id_1005",
                  // "customer_name": "Satoshi Nakamoto"
                  "customer_email": this.customerEmail
                }
              }, {
                headers: {
                  'Content-Type': 'application/json',
                  'X-CC-Api-Key': '9d54856b-51e6-48a1-ab59-559185fd03bf',
                  'X-CC-Version': '2018-03-22'
                }
              }).then((res) => {
                console.log(res.body);
                let txid = res.body.data.code;
                tempWindow.location = res.body.data.hosted_url;

                this.$http.post('/newOrder', {
                  txid: txid,
                  apk: this.activePubKey,
                  opk: this.ownerPubKey,
                  email: this.email,
                  account_name: this.accountName
                }, {
                  credentials: true
                }).then((res) => {
                  console.log(res);
                })

                this.refreshHistory();
                this.shallNotPass = true;
                this.dialogVisible = false;
              })
            } else {
              this.$http.post("https://api.commerce.coinbase.com/charges", {
                "name": "EOS Account Creation Service",
                "description": "4KB RAM，0.2 EOS Staked for CPU/Network",
                "local_price": {
                  "amount": orderPrice,
                  "currency": "USD"
                },
                "pricing_type": "fixed_price",
                "metadata": {
                  // "customer_id": "id_1005",
                  // "customer_name": "Satoshi Nakamoto"
                  "customer_email": this.customerEmail
                }
              }, {
                headers: {
                  'Content-Type': 'application/json',
                  'X-CC-Api-Key': '9d54856b-51e6-48a1-ab59-559185fd03bf',
                  'X-CC-Version': '2018-03-22'
                }
              }).then((res) => {
                console.log(res.body);
                let txid = res.body.data.code;
                tempWindow.location = res.body.data.hosted_url;

                this.$http.post('/newOrder', {
                  txid: txid,
                  apk: this.activePubKey,
                  opk: this.ownerPubKey,
                  email: this.email,
                  account_name: this.accountName
                }, {
                  credentials: true
                }).then((res) => {
                  console.log(res);
                })

                this.refreshHistory();
                this.shallNotPass = true;
                this.dialogVisible = false;
              })
            }
          })
        });


      },
      goCreate () {
        this.dialogVisible = true;
      },
      checkAgree () {
        if (this.agreeEOS && this.agreeUA) {
          this.agreedAll = false;
        } else {
          this.agreedAll = true;
        }
      },
      checkAccount () {
        let availableChar = [ 'a', 'b', 'c', 'd', 'e', 'f',
          'g', 'h', 'i', 'j', 'k', 'l',
          'm', 'n', 'o', 'p', 'q', 'r',
          's', 't', 'u', 'v', 'w', 'x',
          'y', 'z', '1', '2', '3', '4', '5'];
        if (this.accountName.length !== 12) {
          if (!this.langSelect) {
            this.$notify({
              title: '账户名无效',
              type: 'error',
              message: '账户名长度不为 12',
              duration: 5000
            });
          } else {
            this.$notify({
              title: 'Invalid Account Name',
              type: 'error',
              message: 'The Length is not 12 characters',
              duration: 5000
            });
          }
          this.shallNotPass = true;
        } else {
          let checkChar = false;
          for (let a = 0; a < this.accountName.length; a++) {
            let hasLetter = false;
            for (let b = 0; b < availableChar.length; b++) {
              if (this.accountName.charAt(a) === availableChar[b]) {
                hasLetter = true;
                break;
              } else {
                hasLetter = false;
              }
            }
            if (!hasLetter) {
              break;
            } else if (a === 11) {
              checkChar = true
            }
          }
          if (checkChar) {
            eos.getAccount(this.accountName).then((data) => {
              console.log(data);
              if(!this.langSelect) {
                this.$notify({
                  title: '账户名无效',
                  type: 'error',
                  message: '主网存在同名账户',
                  duration: 5000
                });
              } else {
                this.$notify({
                  title: 'Invalid Account Name',
                  type: 'error',
                  message: 'Account name already exists',
                  duration: 5000
                });
              }
              this.shallNotPass = true;
            }).catch((e) => {
              console.log(e);
              if (!this.langSelect) {
                this.$notify({
                  title: '账户名可用',
                  type: 'success',
                  message: '格式正确，并且主网没有同名账户',
                  duration: 5000
                });
              } else {
                this.$notify({
                  title: 'Valid Account Name',
                  type: 'success',
                  message: 'Valid name, No conflict',
                  duration: 5000
                });
              }
              // this.checkOPK();
              eos.getKeyAccounts(this.ownerPubKey).then(() => {
                if (!this.langSelect) {
                  this.$notify({
                    title: 'Owner 公钥正确',
                    type: 'success',
                    message: 'Owner 公钥正确',
                    duration: 5000
                  });
                } else {
                  this.$notify({
                    title: 'Valid Owner Public Key',
                    type: 'success',
                    message: 'Owner Public Key is OK',
                    duration: 5000
                  });
                }
                this.opkOK = true;
              }).catch((e) => {
                console.log(e);
                if (!this.langSelect) {
                  this.$notify({
                    title: 'Owner 公钥错误',
                    type: 'error',
                    message: 'Owner 公钥错误',
                    duration: 5000
                  });
                } else {
                  this.$notify({
                    title: 'Invalid Owner Public Key',
                    type: 'error',
                    message: 'Owner Public Key is wrong',
                    duration: 5000
                  });
                }
                this.opkOK = false;
                this.shallNotPass = true;
              });

              // this.checkAPK();
              eos.getKeyAccounts(this.activePubKey).then(() => {
                if (!this.langSelect) {
                  this.$notify({
                    title: 'Active 公钥正确',
                    type: 'success',
                    message: 'Active 公钥正确',
                    duration: 5000
                  });
                } else {
                  this.$notify({
                    title: 'Valid Active Public Key',
                    type: 'success',
                    message: 'Active Public Key is OK',
                    duration: 5000
                  });
                }
                this.apkOK = true;
                if (this.opkOK && this.apkOK) {
                  this.shallNotPass = false;
                }
              }).catch((e) => {
                console.log(e);
                if (!this.langSelect) {
                  this.$notify({
                    title: 'Active 公钥错误',
                    type: 'error',
                    message: 'Active 公钥错误',
                    duration: 5000
                  });
                } else {
                  this.$notify({
                    title: 'Invalid Active Public Key',
                    type: 'error',
                    message: 'Active Public Key is wrong',
                    duration: 5000
                  });
                }
                this.apkOK = false;
                this.shallNotPass = true;
              });

            });
          } else {
            if (!this.langSelect) {
              this.$notify({
                title: '账户名无效',
                type: 'error',
                message: '使用了规定以外的字符',
                duration: 5000
              });
            } else {
              this.$notify({
                title: 'Invalid Account Name',
                type: 'error',
                message: 'Illegal Character',
                duration: 5000
              });
            }
            this.shallNotPass = true;
          }
        }
      }
    }
  }
</script>

<style scoped>
    @import url('https://fonts.googleapis.com/css?family=Roboto+Condensed');

    #app {
        font-family: 'Roboto Condensed', sourcehansans-sc, Helvetica, sans-serif;
    }
    .body-card {
        width: 100%;
    }
    .h1 {
        font-size: 2rem;
        font-weight: bold;
        margin-top: 50px;
    }
    .hint-label {
        font-size: 0.85rem;
        color: grey;
        margin-top: 5px
    }
    .input-card {
        text-align: center;
    }
</style>