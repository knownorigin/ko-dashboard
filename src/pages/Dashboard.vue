<template>
  <div>

    <!--Stats cards-->
    <div class="row">
      <div class="col-md-6 col-xl-3">
        <stats-card>
          <div class="icon-big icon-default text-center" slot="header">
            <i class="ti-eye"></i>
          </div>
          <div class="numbers" slot="content" v-if="latestBlockNumber > 0">
            <p>BlockNumber</p>
            {{ latestBlockNumber }}
          </div>
        </stats-card>
      </div>

      <div class="col-md-6 col-xl-3">
        <stats-card>
          <div class="icon-big icon-info text-center" slot="header">
            <i class="ti-server"></i>
          </div>
          <div class="numbers" slot="content" v-if="koEvents.length">
            <p>Total events</p>
            {{ koEvents.length }}
          </div>
        </stats-card>
      </div>

      <div class="col-md-6 col-xl-3">
        <stats-card>
          <div class="icon-big icon-warning text-center" slot="header">
            <i class="ti-rocket"></i>
          </div>
          <div class="numbers" slot="content" v-if="koEvents.length">
            <p>Minted assets</p>
            {{ mintedTotal }}
          </div>
        </stats-card>
      </div>

      <div class="col-md-6 col-xl-3">
        <stats-card>
          <div class="icon-big icon-success text-center" slot="header">
            <i class="ti-link"></i>
          </div>
          <div class="numbers" slot="content" v-if="koEvents.length">
            <p>ETH Purchases</p>
            {{ purchasedWithEtherTotal }}
          </div>
        </stats-card>
      </div>

      <div class="col-md-6 col-xl-3">
        <stats-card>
          <div class="icon-big icon-success text-center" slot="header">
            <i class="ti-money"></i>
          </div>
          <div class="numbers" slot="content" v-if="koEvents.length">
            <p>Fiat Purchases</p>
            {{ purchasedWithFiatTotal }}
          </div>
        </stats-card>
      </div>

      <div class="col-md-6 col-xl-3">
        <stats-card>
          <div class="icon-big icon-info text-center" slot="header">
            <i class="ti-direction"></i>
          </div>
          <div class="numbers" slot="content" v-if="koEvents.length">
            <p>Transfers</p>
            {{ nativeTransfer }}
          </div>
        </stats-card>
      </div>

      <div class="col-md-6 col-xl-3">
        <stats-card>
          <div class="icon-big icon-danger text-center" slot="header">
            <i class="ti-alarm-clock"></i>
          </div>
          <div class="numbers" slot="content" v-if="koEvents.length">
            <p>Last 10 days</p>
            {{ purchasedWithEtherInLast60000BlocksTotal }}
          </div>
        </stats-card>
      </div>

      <div class="col-md-6 col-xl-3">
        <stats-card>
          <div class="icon-big icon-danger text-center" slot="header">
            <i class="ti-alarm-clock"></i>
          </div>
          <div class="numbers" slot="content" v-if="koEvents.length">
            <p>Last 24 hours</p>
            {{ purchasedWithEtherInLast6000BlocksTotal }}
          </div>
        </stats-card>
      </div>
    </div>

    <div class="row">

      <div class="col-md-6 col-12">
        <chart-card title="Events By Type"
                    :chart-data="chartData"
                    :chart-options="chartDataOptions"
                    chart-type="Bar" v-if="chartData">
        </chart-card>
        <span v-if="!chartData" class="text-muted">Loading...</span>
      </div>

      <div class="col-md-6 col-12">
        <chart-card title="Mint vs Purchases"
                    :chart-data="pieChartData"
                    chart-type="Pie" v-if="pieChartData">
        </chart-card>
        <span v-if="!pieChartData" class="text-muted">Loading...</span>
      </div>

    </div>

  </div>
</template>
<script>
  import { StatsCard, ChartCard } from '@/components/index';
  import Chartist from 'chartist';
  import axios from 'axios';

  import { db } from '../firebase';

  export default {
    components: {
      StatsCard,
      ChartCard
    },
    mounted: function () {
      this.getBlockNumber();
      this.timer = setInterval(this.getBlockNumber, 10000)
    },
    firestore () {
      return {
        koEvents: db.collection('raw').doc('mainnet').collection('events')
      };
    },
    methods: {
      getBlockNumber () {
        axios.get('https://api.etherscan.io/api?module=proxy&action=eth_blockNumber')
          .then((res) => {
            this.latestBlockNumber = parseInt(res.data.result);
          })
      }
    },
    computed: {
      purchasedWithEtherTotal () {
        const reducer = (accumulator, currentValue) => {
          if (currentValue.event === 'PurchasedWithEther') {
            return accumulator + 1;
          }

          return accumulator;
        };
        return (this.koEvents || []).reduce(reducer, 0);
      },
      purchasedWithEtherInLast60000BlocksTotal () {
        const reducer = (accumulator, currentValue) => {
          if ((currentValue.event === 'PurchasedWithEther' || currentValue.event === 'PurchasedWithFiat') && currentValue.blockNumber > (this.latestBlockNumber - 60000)) {
            return accumulator + 1;
          }

          return accumulator;
        };
        return (this.koEvents || []).reduce(reducer, 0);
      },
      purchasedWithEtherInLast6000BlocksTotal () {
        const reducer = (accumulator, currentValue) => {
          if ((currentValue.event === 'PurchasedWithEther' || currentValue.event === 'PurchasedWithFiat') && currentValue.blockNumber > (this.latestBlockNumber - 6000)) {
            return accumulator + 1;
          }

          return accumulator;
        };
        return (this.koEvents || []).reduce(reducer, 0);
      },
      purchasedWithFiatTotal () {
        const reducer = (accumulator, currentValue) => {
          if (currentValue.event === 'PurchasedWithFiat') {
            return accumulator + 1;
          }

          return accumulator;
        };
        return (this.koEvents || []).reduce(reducer, 0);
      },
      transfer () {
        const reducer = (accumulator, currentValue) => {
          if (currentValue.event === 'Transfer') {
            return accumulator + 1;
          }

          return accumulator;
        };
        return (this.koEvents || []).reduce(reducer, 0);
      },
      approval () {
        const reducer = (accumulator, currentValue) => {
          if (currentValue.event === 'Approval') {
            return accumulator + 1;
          }

          return accumulator;
        };
        return (this.koEvents || []).reduce(reducer, 0);
      },
      mintedTotal () {
        const reducer = (accumulator, currentValue) => {
          if (currentValue.event === 'Transfer' && currentValue.eventValues._from === '0x0000000000000000000000000000000000000000') {
            return accumulator + 1;
          }

          return accumulator;
        };
        return (this.koEvents || []).reduce(reducer, 0) - this.burned;
      },
      burned () {
        const reducer = (accumulator, currentValue) => {
          if (currentValue.event === 'Transfer' && currentValue.eventValues._to === '0x0000000000000000000000000000000000000000') {
            return accumulator + 1;
          }

          return accumulator;
        };
        return (this.koEvents || []).reduce(reducer, 0);
      },
      nativeTransfer () {
        const reducer = (accumulator, currentValue) => {
          if (currentValue.event === 'Transfer' && (currentValue.eventValues._from !== '0x0000000000000000000000000000000000000000' && currentValue.eventValues._from !== '0x3f8C962eb167aD2f80C72b5F933511CcDF0719D4') && (currentValue.eventValues._to !== '0x0000000000000000000000000000000000000000')) {
            return accumulator + 1;
          }

          return accumulator;
        };
        return (this.koEvents || []).reduce(reducer, 0);
      },
      pieChartData () {
        let minted = this.mintedTotal;
        let purchased = this.purchasedWithFiatTotal + this.purchasedWithEtherTotal;
        let burned = this.burned;

        if (minted === 0) {
          return false;
        }

        return {
          labels: ['Minted', 'Purchased', 'Burned'],
          series: [minted, purchased, burned]
        };
      },
      chartData () {
        let minted = this.mintedTotal;
        let purchasedWithFiat = this.purchasedWithFiatTotal;
        let purchasedWithEther = this.purchasedWithEtherTotal;
        let transfer = this.transfer;
        let approval = this.approval;

        if (minted === 0) {
          return false;
        }

        return {
          labels: ['Fiat', 'Ether', 'Transfer', 'Approval'],
          series: [[purchasedWithFiat, purchasedWithEther, transfer, approval]]
        };
      }
    },
    data () {
      return {
        koEvents: [],
        latestBlockNumber: 0,
        chartDataOptions: {
          seriesBarDistance: 10,
          axisX: {
            showGrid: false
          }
        }
      };
    },
    beforeDestroy() {
      clearInterval(this.timer)
    }
  };
</script>
<style>
</style>
