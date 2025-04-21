import {
  CandlestickSeries,
  ColorType,
  createChart,
  CrosshairMode,
  ISeriesApi,
  UTCTimestamp,
} from "lightweight-charts";

export class Chartmanager {
  private candleSeries: ISeriesApi<"Candlestick">;
  private lastupdateTime: number = 0;
  private chart: any;
  private currentBar: {
    open: number | null;
    high: number | null;
    low: number | null;
    close: number | null;
  } = {
    open: null,
    high: null,
    low: null,
    close: null,
  };

  constructor(
    ref: any,
    initialData: any[],
    Layout: { background: string; color: string }
  ) {
    const chart = createChart(ref, {
      autoSize: true,
      overlayPriceScales: {
        ticksVisible: true,
        borderVisible: true,
      },
      crosshair: {
        mode: CrosshairMode.Normal,
      },
      rightPriceScale: {
        visible: true,
        ticksVisible: true,
        entireTextOnly: true,
      },
      grid: {
        horzLines: {
          visible: true,
        },
        vertLines: {
          visible: false,
        },
      },
      layout: {
        background: {
          type: ColorType.Solid,
          color: Layout.background,
        },
        textColor: "white",
      },
    });
    this.chart = chart;
    this.candleSeries = chart.addSeries(CandlestickSeries);

    this.candleSeries.setData(
      initialData
        .sort(
          (a, b) => new Date(a.bucket).getTime() - new Date(b.bucket).getTime()
        )
        .map((data) => ({
          ...data,
          time: (data.timestamp / 1000) as UTCTimestamp,
        }))
    );
  }
  public update(updatePrice: any) {
    if (!this.lastupdateTime) {
      this.lastupdateTime = new Date().getTime();
    }

    this.candleSeries.update({
      time: (this.lastupdateTime / 1000) as UTCTimestamp,
      close: updatePrice.close,
      low: updatePrice.low,
      high: updatePrice.high,
      open: updatePrice.open,
    });

    if (updatePrice.newCandleInitiated) {
      this.lastupdateTime = updatePrice.time;
    }
  }
  public destroy() {
    this.chart.remove();
  }
}
