<template>
    <div id="app">
        <el-main>
            <el-row justify="center" type="flex">
                <el-card class="body-card" type="flex">
                    <el-switch style="float: right;" @change="switchLang()" v-model="langSelect" inactive-text="中文" active-text="English" active-color="#409EFF" inactive-color="#409EFF"/>
                    <div style="margin-top: 30px;">
                        <span class="h1">EOS 账号创建服务</span>
                    </div>
                    <h3>实时定价，加密货币支付</h3>
                    <hr>
                    <div>EOS的机制决定了，新账号需要一个已经拥有账号的人去创建，来给新账户支付一些 RAM（内存，使用EOS支付）。如果您在我们的网站注册，我们会帮助您生成一个拥有 4KB RAM 和 0.2 EOS（用以 CPU 以及网络带宽），您只需要提供公钥和10%的手续费。</div>
                    <br>
                    <el-card class="input-card">
                        <el-row type="flex" justify="space-between">
                            <el-col :xs="1" :sm="2" :md="2" :lg="2" :xl="2"><span>&nbsp;</span></el-col>
                            <el-col :xs="22" :sm="8" :md="8" :lg="8" :xl="8"><el-input @change="paramChanged()" placeholder="账号名" v-model="accountName"/></el-col>
                            <el-col :xs="1" :sm="2" :md="2" :lg="2" :xl="2"><span>&nbsp;</span></el-col>
                        </el-row>
                        <div class="hint-label">*EOS 账户名长度必须正好 12 字符，仅能由 小写字母 以及 1 2 3 4 5 组成</div>
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

                        <div class="hint-label">*可以都填需创建账户的公钥</div>
                        <el-row type="flex" justify="space-between" style="margin-top: 18px">
                            <el-col :xs="1" :sm="2" :md="2" :lg="2" :xl="2"><span>&nbsp;</span></el-col>
                            <el-col :xs="22" :sm="8" :md="8" :lg="8" :xl="8"><el-input placeholder="电子邮件" v-model="customerEmail"/></el-col>
                            <el-col :xs="1" :sm="2" :md="2" :lg="2" :xl="2"><span>&nbsp;</span></el-col>
                        </el-row>
                        <div class="hint-label">*仅出于便于联系的目的，可不填</div>
                        <el-button type="default" style="margin-top: 10px" @click="checkAccount()">检查可用性</el-button>
                        <el-button type="primary" style="margin-top: 10px" @click="goCreate()" :disabled="shallNotPass">创建 EOS 主网账户</el-button>
                        <div class="hint-label">*点击后，请耐心等待付款页面加载</div>

                        <el-dialog width="90%" title="确认购买我们的服务" :visible.sync="dialogVisible">
                            <el-row justify="center" type="flex">
                                <el-collapse accordion style="width: 90%">
                                    <el-collapse-item title="请阅读并同意《EOS宪法》">
                                        <el-checkbox style="margin-top: 10px" v-model="agreeEOS" @change="checkAgree()">我已经阅读并且同意<a target="_Blank" href="https://github.com/EOS-Mainnet/governance/blob/master/eosio.system/eosio.system-clause-constitution-rc.md">《EOS宪法》</a></el-checkbox>
                                    </el-collapse-item>
                                    <el-collapse-item title="请阅读并同意《用户政策》">
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
                                        <el-checkbox v-model="agreeUA" @change="checkAgree()">我已经阅读并且同意《用户政策》</el-checkbox>
                                    </el-collapse-item>
                                </el-collapse>
                            </el-row>
                            <div style="margin-top: 10px">
                                <el-button style="width: 70%" type="primary" :disabled="agreedAll"
                                           @click="goPay()">
                                    <span>使用加密货币付款</span>
                                </el-button>
                            </div>
                        </el-dialog>

                    </el-card>
                </el-card>
            </el-row>

            <el-row justify="center" type="flex" style="margin-top: 10px">
                <el-card class="body-card">
                    <div style="margin-top: 20px; margin-bottom: 10px">
                        <span class="h1">历史订单</span>
                        <el-button type="medium" style="float: right;" @click="refreshHistory()"><i class="el-icon-refresh"></i></el-button>
                    </div>
                    <el-table :data="historyDataTranslated" stripe style="width: 100%">
                        <el-table-column prop="txid" label="付款ID"/>
                        <el-table-column prop="account_name" label="账户名"/>
                        <el-table-column prop="pay_status" label="付款进度"/>
                        <el-table-column prop="reg_status" label="创建进度"/>
                    </el-table>
                </el-card>
            </el-row>

            <el-row justify="center" type="flex" style="margin-top: 10px">
                <el-card class="body-card">
                    <div style="margin-top: 20px; margin-bottom: 10px">
                        <span class="h1">提示</span>
                    </div>
                    <h3>什么是 Active / Owner Public Key ？</h3>
                    <p>Active Public Key（ Active 公钥 ）的所有者拥有账号功能的行使权，而 Owner Public Key（ Owner 公钥）的所有者拥有账号的所有权。</p>
                    <h3>显示已付款也没有注册成功，怎么办 / 如何联系你们？</h3>
                    <p>请致邮件到 realgeowat@gmail.com，或加入 <a href="https://t.me/joinchat/GUzUNA-IhCx-TW3k7MOw0g" target="_blank">Telegram 群组</a>。不用担心，我们都有记录。</p>
                    <h3>如何计费？</h3>
                    <p>费用计算公式：<br>[( 4KB 内存 * 每 KB 的 EOS 价格 ）+ 0.1 EOS CPU 资源质押 + 0.1 EOS 网络资源质押 + 0.2 EOS 内存转账手续费 ] * 实时 Bitfinex EOS/USDT 价格 + 10% 服务费<br><br>我们在此过程中收取的费用只有 10% 服务费，用于我们在资金周转中的手续费用。没有其他额外费用。</p>
                    <h3>安全吗？</h3>
                    <p>整个注册过程中我们不需要您的私钥。您的账号是安全的。当然，为了您更加放心，我们开放了<a href="https://github.com/iamGeoWat/eosreg" target="_blank">源码</a>。</p>
                    <h3>EOS 账号结构解释</h3>
                    <p>EOS 账号设置在公钥-私钥对（ KeyPair ）下，一个公钥下可以有多个账号。拥有私钥即拥有其对应的公钥下所有账号的控制权。</p>
                    <h3>如何生成自己的公钥-私钥对（KeyPair）？</h3>
                    <p>出于安全原因，我们不为您提供生成 公钥-私钥对 的服务。私钥必须由您一人掌握。<br>建议您使用 EOSNewYork 支持开发的开源 Chrome 浏览器插件 <a href="https://get-scatter.com/" target="_blank">Scatter</a> 来管理、生成 公钥-私钥对。<br> 您也可以使用您习惯的 EOS 钱包 App 。</p>
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
    name: 'lang-zhs',
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
        langSelect: false
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
          this.$http.get('https://api-pub.bitfinex.com/v2/ticker/tEOSUSD').then((res) => {
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