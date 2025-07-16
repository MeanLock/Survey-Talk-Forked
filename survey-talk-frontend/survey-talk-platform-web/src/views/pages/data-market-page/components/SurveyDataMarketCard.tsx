import type React from "react";
import type { SurveyDataMarket } from "../../../../core/types";
import "./CardStyle.scss";
import SurveyDefaultImg from "../../../../assets/Image/Logo/SurveyCardDefaultImg.png";
import { SurveyTopics } from "../../../../core/mockData/mockData";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  LabelList,
} from "recharts";

interface Props {
  survey: SurveyDataMarket;
  onViewDetail: (id: number) => void;
}

const CustomDot = (props: any) => {
  const { cx, cy, payload } = props;
  return (
    <>
      <circle
        cx={cx}
        cy={cy}
        r={4}
        fill="#4FC3F7"
        stroke="white"
        strokeWidth={1}
      />
      <text
        x={cx}
        y={cy + 12}
        textAnchor="middle"
        fontSize={10}
        fill="#555"
        style={{ pointerEvents: "none" }}
      >
        {payload.version}
      </text>
    </>
  );
};

export const SurveyDataMarketCard: React.FC<Props> = ({
  survey,
  onViewDetail,
}) => {
  const versionData = survey.VersionTrackings.map((v) => ({
    date: v.ExpiredAt,
    contributor: v.ContributorCount,
    version: `v${v.Version}`,
  }));
  // FUNCTIONS
  const getTopicName = (id: number) => {
    return SurveyTopics.filter((t) => t.id === id)[0].name;
  };
  const getTotalPrice = (versions: any) => {
    return versions.reduce((sum: any, item: any) => {
      return sum + (item.CurrentVersionPrice || 0);
    }, 0);
  };

  const getTotalContributor = (versions: any) => {
    return versions.reduce((sum: any, item: any) => {
      return sum + (item.ContributorCount || 0);
    }, 0);
  };

  return (
    <div className="data-card__container">
      <div className="data-card__header w-full flex gap-3">
        <div className="data-card__header-image">
          <img src={survey.MainImageUrl || SurveyDefaultImg} />
        </div>
        <div className="data-card__header-title-topic flex flex-col items-start">
          <p className="topic">{getTopicName(survey.SurveyTopicId)}</p>
          <p className="title">{survey.Title}</p>
        </div>
      </div>
      <div className="data-card__price w-full flex flex-col items-start mt-5">
        <p className="total-price">
          {getTotalPrice(survey.VersionTrackings).toLocaleString("vn")}đ
        </p>

        <div className="total-contributor w-full flex flex-col items-start">
          <p className="title">Size Of Data</p>
          <p className="value">
            {getTotalContributor(survey.VersionTrackings)} contributors
          </p>

          {/* Chart phân phối dữ liệu của contributor của từng version */}
          <div className="contributor-distribution w-full mt-2 h-1.5 rounded-full overflow-hidden bg-gray-200 flex">
            {survey.VersionTrackings.map((v, index) => {
              const widthPercent =
                (v.ContributorCount /
                  getTotalContributor(survey.VersionTrackings)) *
                100;
              const isFirst = index === 0;
              const isLast = index === survey.VersionTrackings.length - 1;

              const colorClasses = [
                "bg-[#B6EDFC]",
                "bg-[#72D7FF]",
                "bg-[#0AB2FB]",
                "bg-[#0B8EC7]",
                "bg-[#0B6882]",
              ];
              const color = colorClasses[index % colorClasses.length];
              const roundedClass = isFirst
                ? "rounded-l-full"
                : isLast
                ? "rounded-r-full"
                : "";

              return (
                <div
                  key={v.Version}
                  className={`h-full ${color} ${roundedClass}`}
                  style={{ width: `${widthPercent}%` }}
                />
              );
            })}
          </div>

          <div className="version-details w-full flex flex-col gap-2 mt-3">
            {survey.VersionTrackings.map((v, index) => {
              const colorClasses = [
                "bg-[#B6EDFC]",
                "bg-[#72D7FF]",
                "bg-[#0AB2FB]",
                "bg-[#0B8EC7]",
                "bg-[#0B6882]",
              ];
              const color = colorClasses[v.Version + 1];
              return (
                <div key={v.Version} className="grid grid-cols-12">
                  <div className="col-span-3 flex items-center justify-start gap-1">
                    <div className={`w-2 h-2 rounded-full ${color}`}></div>
                    <div className="font-bold">Version {v.Version}</div>
                  </div>
                  <div className="col-span-5 flex items-center justify-end">
                    <p>{v.ContributorCount} contributors</p>
                  </div>
                  <div className="col-span-4 flex items-center justify-end">
                    <p>{v.CurrentVersionPrice.toLocaleString("vn")}đ</p>
                  </div>
                </div>
              );
            })}
          </div>

          <ResponsiveContainer
            width="100%"
            height={45}
            className="mt-3 border-t-1 border-b-1 border-gray-300"
          >
            <LineChart
              data={versionData}
              margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
            >
              {/* Ẩn trục X để không bị đè nhãn */}
              <XAxis hide />
              <YAxis hide />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="contributor"
                stroke="#888"
                strokeWidth={1.5}
                dot={<CustomDot />}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>

          <div className="mt-2 w-full flex items-center justify-end">
            <div
              onClick={() => onViewDetail(survey.Id)}
              className="bg-[#3e5dab] hover:bg-[#677eb3] px-3 rounded-lg cursor-pointer text-white text-[15px] font-bold"
            >
              Xem Chi Tiết
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
