<template>
  <div>

    <!--Stats cards-->
    <div class="row">
      <div class="col-md-6 col-xl-3">
        <stats-card>
          <div class="icon-big icon-info text-center" slot="header">
            <i class="ti-server"></i>
          </div>
          <div class="numbers" slot="content">
            <p>Total events</p>
            {{ koEvents.length }}
          </div>
        </stats-card>
      </div>

      <div class="col-md-6 col-xl-3">
        <stats-card>
          <div class="icon-big icon-success text-center" slot="header">
            <i class="ti-rocket"></i>
          </div>
          <div class="numbers" slot="content">
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
          <div class="numbers" slot="content">
            <p>ETH Purchases</p>
            {{ purchasedWithEtherTotal }}
          </div>
        </stats-card>
      </div>

      <div class="col-md-6 col-xl-3">
        <stats-card>
          <div class="icon-big icon-warning text-center" slot="header">
            <i class="ti-money"></i>
          </div>
          <div class="numbers" slot="content">
            <p>Fiat Purchases</p>
            {{ purchasedWithFiatTotal }}
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

        {{ pieChartData }}
      </div>

    </div>

  </div>
</template>
<script>
  import { StatsCard, ChartCard } from '@/components/index';
  import Chartist from 'chartist';

  import { db } from '../firebase';

  export default {
    components: {
      StatsCard,
      ChartCard
    },
    firestore () {
      return {
        koEvents: db.collection('raw').doc('mainnet').collection('events')
      };
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
        return (this.koEvents || []).reduce(reducer, 0);
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
        chartDataOptions: {
          seriesBarDistance: 10,
          axisX: {
            showGrid: false
          }
        }
      };
    }
  };
</script>
<style>
</style>
