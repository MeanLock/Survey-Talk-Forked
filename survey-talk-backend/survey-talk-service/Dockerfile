FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER app
WORKDIR /app

EXPOSE 8002


FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src


COPY SurveyTalkService.API/ ./API/
COPY SurveyTalkService.BusinessLogic/ ./BusinessLogic/
COPY SurveyTalkService.Common/ ./Common/
COPY SurveyTalkService.DataAccess/ ./DataAccess/

RUN dotnet restore "API/SurveyTalkService.API.csproj"



COPY . . 
WORKDIR /src/API
RUN dotnet build "SurveyTalkService.API.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
RUN dotnet publish "SurveyTalkService.API.csproj" -c $BUILD_CONFIGURATION -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "SurveyTalkService.API.dll"]