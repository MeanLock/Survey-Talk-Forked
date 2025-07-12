import { FC, useEffect, useState } from "react";
import { Row, Col, Card } from "react-bootstrap";
import { getSummaryCountAccountBalance, getSummaryProfitTransactionReport } from "../../../../core/services/statistic/transaction-statistics/transaction-statistics.service";
import { adminAxiosInstance } from "../../../../core/api/rest-api/config/instances/v2";
import { SummaryAccountBalanceCount, SummaryAccountRegistrationCount, SummaryProfit } from "../../../../core/types/statistics";
import { getSummaryCountAccountRegistration } from "../../../../core/services/statistic/user-statistics/user-statistics.service";

// Constants
const TIME_PERIODS = {
    Daily: "hôm qua",
    Weekly: "tuần trước",
    Monthly: "tháng trước",
    Yearly: "năm trước"
} as const;

type TimePeriod = keyof typeof TIME_PERIODS;

interface MetricItem {
    title: string;
    value: string | number;
    change: {
        percent: string;
        comparison: string;
    };
    changeType: "increase" | "decrease" | "neutral";
}


const formatValue = (value: number): string => {
    return value.toLocaleString("vi-VN");
};

const getChangeType = (percentChange?: number): "increase" | "decrease" | "neutral" => {
    if (percentChange === undefined) return "neutral";
    return percentChange >= 0 ? "increase" : "decrease";
};

const createMetric = (
    title: string,
    value: number | undefined,
    percentChange: number | undefined,
    period: string,
    formatter?: (val: number) => string
): MetricItem => {
    const formattedValue = value !== undefined
        ? (formatter ? formatter(value) : value.toString())
        : "Đang tải...";

    return {
        title,
        value: formattedValue,
        change: {
            percent: percentChange !== undefined ? `${Math.abs(percentChange)} %` : "Đang tải...",
            comparison: ` so với ${period}`
        },
        changeType: getChangeType(percentChange)
    };
};


const getMetricsForPeriod = (
    period: TimePeriod,
    {
        summaryProfit,
        registrationCount,
        accountBalance
    }: {
        summaryProfit: SummaryProfit | null;
        registrationCount: SummaryAccountRegistrationCount | null;
        accountBalance: SummaryAccountBalanceCount | null;
    }
): MetricItem[] => {
    const comparisonPeriod = TIME_PERIODS[period];
    const titlePrefix = period === "Daily" ? "hôm nay" :
        period === "Weekly" ? "tuần này" :
            period === "Monthly" ? "tháng này" : "năm hiện tại";

    return [
        createMetric(
            `Doanh thu ${titlePrefix}`,
            summaryProfit?.TotalRevenue,
            summaryProfit?.PercentChange,
            comparisonPeriod,
            (val) => `${formatValue(val)} VND`
        ),
        createMetric(
            `Người dùng mới ${titlePrefix}`,
            registrationCount?.NewRegistrationCount,
            registrationCount?.PercentChange,
            comparisonPeriod
        ),
        createMetric(
            "Số lượng giao dịch Nạp",
            accountBalance?.DepositTransactionCount,
            accountBalance?.DepositTransactionPercentChange,
            comparisonPeriod
        ),
        createMetric(
            "Số lượng giao dịch Rút",
            accountBalance?.WithdrawalTransactionCount,
            accountBalance?.WithdrawalTransactionPercentChange,
            comparisonPeriod
        )
    ];
};

const MetricsCards: FC<{ activeTab: any }> = ({ activeTab }) => {
    const [summaryProfit, setSummaryProfit] = useState<SummaryProfit | null>(null);
    const [accountBalance, setAccountBalance] = useState<SummaryAccountBalanceCount | null>(null);
    const [registrationCount, setRegistrationCount] = useState<SummaryAccountRegistrationCount | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [summaryProfitRes, accountBalanceRes, registrationCountRes] = await Promise.all([
                    getSummaryProfitTransactionReport(adminAxiosInstance, activeTab),
                    getSummaryCountAccountBalance(adminAxiosInstance, activeTab),
                    getSummaryCountAccountRegistration(adminAxiosInstance, activeTab),
                ]);

                setSummaryProfit(summaryProfitRes.success ? summaryProfitRes.data : null);
                setAccountBalance(accountBalanceRes.success ? accountBalanceRes.data : null);
                setRegistrationCount(registrationCountRes.success ? registrationCountRes.data : null);
            } catch (error) {
                console.error("Error fetching metrics data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [activeTab]);

    const metrics = loading
        ? [{
            title: "Đang tải...",
            value: "Đang tải...",
            change: { percent: "Đang tải...", comparison: "" },
            changeType: "neutral"
        }]
        : getMetricsForPeriod(activeTab, { summaryProfit, registrationCount, accountBalance });

    return (
        <Row className="mb-4">
            {metrics.map((metric, index) => (
                <Col key={index} xs={12} sm={6} lg={3} className="mb-3">
                    <Card className="MetricsCards__card">
                        <Card.Body>
                            <div className="d-flex flex-column">
                                <small className="mb-4 fw-semibold">{metric.title}</small>
                                <h3 className="mb-2 fw-bold mt-3">{metric.value}</h3>
                                <small className="d-flex align-items-center">
                                    {metric.changeType === "increase" && <span className="text-success me-1">↗</span>}
                                    {metric.changeType === "decrease" && <span className="text-danger me-1">↘</span>}
                                    <span className={metric.changeType === "increase" ? "text-success" :
                                        metric.changeType === "decrease" ? "text-danger" : ""}>
                                        {metric.change.percent}
                                    </span>
                                    <span className=" ms-2">{metric.change.comparison}</span>
                                </small>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            ))}
        </Row>
    );
};

export default MetricsCards;