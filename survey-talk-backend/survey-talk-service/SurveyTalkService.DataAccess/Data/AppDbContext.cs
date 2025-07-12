using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using SurveyTalkService.DataAccess.Entities;

namespace SurveyTalkService.DataAccess.Data;

public partial class AppDbContext : DbContext
{
    public AppDbContext()
    {
    }

    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Account> Accounts { get; set; }

    public virtual DbSet<AccountBalanceTransaction> AccountBalanceTransactions { get; set; }

    public virtual DbSet<AccountGeneralConfig> AccountGeneralConfigs { get; set; }

    public virtual DbSet<AccountLevelSettingConfig> AccountLevelSettingConfigs { get; set; }

    public virtual DbSet<AccountOnlineTracking> AccountOnlineTrackings { get; set; }

    public virtual DbSet<AccountProfile> AccountProfiles { get; set; }

    public virtual DbSet<AccountVerification> AccountVerifications { get; set; }

    public virtual DbSet<DataPurchase> DataPurchases { get; set; }

    public virtual DbSet<FilterTag> FilterTags { get; set; }

    public virtual DbSet<FilterTagType> FilterTagTypes { get; set; }

    public virtual DbSet<PasswordResetToken> PasswordResetTokens { get; set; }

    public virtual DbSet<Role> Roles { get; set; }

    public virtual DbSet<Survey> Surveys { get; set; }

    public virtual DbSet<SurveyCommunityTransaction> SurveyCommunityTransactions { get; set; }

    public virtual DbSet<SurveyDefaultBackgroundTheme> SurveyDefaultBackgroundThemes { get; set; }

    public virtual DbSet<SurveyFeedback> SurveyFeedbacks { get; set; }

    public virtual DbSet<SurveyFieldInputType> SurveyFieldInputTypes { get; set; }

    public virtual DbSet<SurveyGeneralConfig> SurveyGeneralConfigs { get; set; }

    public virtual DbSet<SurveyMarket> SurveyMarkets { get; set; }

    public virtual DbSet<SurveyMarketConfig> SurveyMarketConfigs { get; set; }

    public virtual DbSet<SurveyMarketResponseVersion> SurveyMarketResponseVersions { get; set; }

    public virtual DbSet<SurveyMarketTransaction> SurveyMarketTransactions { get; set; }

    public virtual DbSet<SurveyMarketVersionStatusTracking> SurveyMarketVersionStatusTrackings { get; set; }

    public virtual DbSet<SurveyOption> SurveyOptions { get; set; }

    public virtual DbSet<SurveyQuestion> SurveyQuestions { get; set; }

    public virtual DbSet<SurveyQuestionType> SurveyQuestionTypes { get; set; }

    public virtual DbSet<SurveyResponse> SurveyResponses { get; set; }

    public virtual DbSet<SurveyRewardTracking> SurveyRewardTrackings { get; set; }

    public virtual DbSet<SurveySecurityMode> SurveySecurityModes { get; set; }

    public virtual DbSet<SurveySecurityModeConfig> SurveySecurityModeConfigs { get; set; }

    public virtual DbSet<SurveySpecificTopic> SurveySpecificTopics { get; set; }

    public virtual DbSet<SurveyStatus> SurveyStatuses { get; set; }

    public virtual DbSet<SurveyStatusTracking> SurveyStatusTrackings { get; set; }

    public virtual DbSet<SurveyTagFilter> SurveyTagFilters { get; set; }

    public virtual DbSet<SurveyTakenResult> SurveyTakenResults { get; set; }

    public virtual DbSet<SurveyTakenResultTagFilter> SurveyTakenResultTagFilters { get; set; }

    public virtual DbSet<SurveyTakerSegment> SurveyTakerSegments { get; set; }

    public virtual DbSet<SurveyTimeRateConfig> SurveyTimeRateConfigs { get; set; }

    public virtual DbSet<SurveyTopic> SurveyTopics { get; set; }

    public virtual DbSet<SurveyTopicFavorite> SurveyTopicFavorites { get; set; }

    public virtual DbSet<SurveyType> SurveyTypes { get; set; }

    public virtual DbSet<SystemConfigProfile> SystemConfigProfiles { get; set; }

    public virtual DbSet<TakerTagFilter> TakerTagFilters { get; set; }

    public virtual DbSet<TransactionStatus> TransactionStatuses { get; set; }

    public virtual DbSet<TransactionType> TransactionTypes { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        
    }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.UseCollation("SQL_Latin1_General_CP1_CI_AS");

        modelBuilder.Entity<Account>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Account__3213E83FEA4A73EA");

            entity.ToTable("Account", tb => tb.HasTrigger("trg_Account_Update"));

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Address)
                .HasMaxLength(250)
                .HasColumnName("address");
            entity.Property(e => e.Balance)
                .HasColumnType("decimal(18, 2)")
                .HasColumnName("balance");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(CONVERT([datetime],(sysdatetimeoffset() AT TIME ZONE 'N. Central Asia Standard Time')))")
                .HasColumnType("datetime")
                .HasColumnName("createdAt");
            entity.Property(e => e.DeactivatedAt)
                .HasColumnType("datetime")
                .HasColumnName("deactivatedAt");
            entity.Property(e => e.Dob).HasColumnName("dob");
            entity.Property(e => e.Email)
                .HasMaxLength(250)
                .IsUnicode(false)
                .HasColumnName("email");
            entity.Property(e => e.FullName)
                .HasMaxLength(250)
                .HasColumnName("fullName");
            entity.Property(e => e.Gender)
                .HasMaxLength(250)
                .HasColumnName("gender");
            entity.Property(e => e.IsFilterSurveyRequired).HasColumnName("isFilterSurveyRequired");
            entity.Property(e => e.IsVerified).HasColumnName("isVerified");
            entity.Property(e => e.LastFilterSurveyTakenAt)
                .HasColumnType("datetime")
                .HasColumnName("lastFilterSurveyTakenAt");
            entity.Property(e => e.Level)
                .HasDefaultValue(1)
                .HasColumnName("level");
            entity.Property(e => e.Password)
                .HasMaxLength(250)
                .IsUnicode(false)
                .HasColumnName("password");
            entity.Property(e => e.Phone)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("phone");
            entity.Property(e => e.ProgressionSurveyCount).HasColumnName("progressionSurveyCount");
            entity.Property(e => e.RoleId).HasColumnName("roleId");
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("(CONVERT([datetime],(sysdatetimeoffset() AT TIME ZONE 'N. Central Asia Standard Time')))")
                .HasColumnType("datetime")
                .HasColumnName("updatedAt");
            entity.Property(e => e.Xp).HasColumnName("xp");

            entity.HasOne(d => d.Role).WithMany(p => p.Accounts)
                .HasForeignKey(d => d.RoleId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Account__roleId__3F115E1A");
        });

        modelBuilder.Entity<AccountBalanceTransaction>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__AccountB__3213E83FD6BA0B57");

            entity.ToTable("AccountBalanceTransaction");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.AccountId).HasColumnName("accountId");
            entity.Property(e => e.Amount)
                .HasColumnType("decimal(18, 2)")
                .HasColumnName("amount");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(CONVERT([datetime],(sysdatetimeoffset() AT TIME ZONE 'N. Central Asia Standard Time')))")
                .HasColumnType("datetime")
                .HasColumnName("createdAt");
            entity.Property(e => e.TransactionStatusId).HasColumnName("transactionStatusId");
            entity.Property(e => e.TransactionTypeId).HasColumnName("transactionTypeId");

            entity.HasOne(d => d.Account).WithMany(p => p.AccountBalanceTransactions)
                .HasForeignKey(d => d.AccountId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__AccountBa__accou__0B5CAFEA");

            entity.HasOne(d => d.TransactionStatus).WithMany(p => p.AccountBalanceTransactions)
                .HasForeignKey(d => d.TransactionStatusId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__AccountBa__trans__0D44F85C");

            entity.HasOne(d => d.TransactionType).WithMany(p => p.AccountBalanceTransactions)
                .HasForeignKey(d => d.TransactionTypeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__AccountBa__trans__0C50D423");
        });

        modelBuilder.Entity<AccountGeneralConfig>(entity =>
        {
            entity.HasKey(e => e.ConfigProfileId).HasName("PK__AccountG__D540A124BEE55FA6");

            entity.ToTable("AccountGeneralConfig");

            entity.Property(e => e.ConfigProfileId)
                .ValueGeneratedNever()
                .HasColumnName("configProfileId");
            entity.Property(e => e.DailyActiveCountPeriod).HasColumnName("dailyActiveCountPeriod");
            entity.Property(e => e.FilterSurveyCycle).HasColumnName("filterSurveyCycle");
            entity.Property(e => e.SafetyFilterRate).HasColumnName("safetyFilterRate");
            entity.Property(e => e.XpLevelThreshold).HasColumnName("xpLevelThreshold");

            entity.HasOne(d => d.ConfigProfile).WithOne(p => p.AccountGeneralConfig)
                .HasForeignKey<AccountGeneralConfig>(d => d.ConfigProfileId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__AccountGe__confi__40058253");
        });

        modelBuilder.Entity<AccountLevelSettingConfig>(entity =>
        {
            entity.HasKey(e => new { e.ConfigProfileId, e.Level });

            entity.ToTable("AccountLevelSettingConfig");

            entity.Property(e => e.ConfigProfileId).HasColumnName("configProfileId");
            entity.Property(e => e.Level).HasColumnName("level");
            entity.Property(e => e.BonusRate).HasColumnName("bonusRate");
            entity.Property(e => e.DailyReductionXp).HasColumnName("dailyReductionXp");
            entity.Property(e => e.ProgressionSurveyCount).HasColumnName("progressionSurveyCount");

            entity.HasOne(d => d.ConfigProfile).WithMany(p => p.AccountLevelSettingConfigs)
                .HasForeignKey(d => d.ConfigProfileId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__AccountLe__confi__40F9A68C");
        });

        modelBuilder.Entity<AccountOnlineTracking>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__AccountO__3213E83F6B5F1830");

            entity.ToTable("AccountOnlineTracking");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.AccountId).HasColumnName("accountId");
            entity.Property(e => e.OnlineDate)
                .HasDefaultValueSql("(CONVERT([date],(sysdatetimeoffset() AT TIME ZONE 'N. Central Asia Standard Time')))")
                .HasColumnName("onlineDate");
            entity.Property(e => e.SurveyTakenCount)
                .HasDefaultValue(1)
                .HasColumnName("surveyTakenCount");

            entity.HasOne(d => d.Account).WithMany(p => p.AccountOnlineTrackings)
                .HasForeignKey(d => d.AccountId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__AccountOn__accou__41EDCAC5");
        });

        modelBuilder.Entity<AccountProfile>(entity =>
        {
            entity.HasKey(e => e.AccountId).HasName("PK__AccountP__F267251E16028AB1");

            entity.ToTable("AccountProfile");

            entity.Property(e => e.AccountId)
                .ValueGeneratedNever()
                .HasColumnName("accountId");
            entity.Property(e => e.AverageIncome)
                .HasMaxLength(250)
                .HasColumnName("averageIncome");
            entity.Property(e => e.CountryRegion)
                .HasMaxLength(250)
                .HasColumnName("countryRegion");
            entity.Property(e => e.DistrictCode).HasColumnName("districtCode");
            entity.Property(e => e.EducationLevel)
                .HasMaxLength(250)
                .HasColumnName("educationLevel");
            entity.Property(e => e.JobField)
                .HasMaxLength(250)
                .HasColumnName("jobField");
            entity.Property(e => e.MaritalStatus)
                .HasMaxLength(250)
                .HasColumnName("maritalStatus");
            entity.Property(e => e.ProvinceCode).HasColumnName("provinceCode");
            entity.Property(e => e.WardCode).HasColumnName("wardCode");

            entity.HasOne(d => d.Account).WithOne(p => p.AccountProfile)
                .HasForeignKey<AccountProfile>(d => d.AccountId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__AccountPr__accou__42E1EEFE");
        });

        modelBuilder.Entity<AccountVerification>(entity =>
        {
            entity.HasKey(e => e.AccountId).HasName("PK__AccountV__F267251EE8B84095");

            entity.ToTable("AccountVerification");

            entity.Property(e => e.AccountId)
                .ValueGeneratedNever()
                .HasColumnName("accountId");
            entity.Property(e => e.ExpirationDate).HasColumnName("expirationDate");
            entity.Property(e => e.NationalCardNumber).HasColumnName("nationalCardNumber");
            entity.Property(e => e.VerifiedAt)
                .HasColumnType("datetime")
                .HasColumnName("verifiedAt");

            entity.HasOne(d => d.Account).WithOne(p => p.AccountVerification)
                .HasForeignKey<AccountVerification>(d => d.AccountId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__AccountVe__accou__43D61337");
        });

        modelBuilder.Entity<DataPurchase>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__DataPurc__3213E83FFD4DD507");

            entity.ToTable("DataPurchase");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.BuyerId).HasColumnName("buyerId");
            entity.Property(e => e.MarketSurveyId).HasColumnName("marketSurveyId");
            entity.Property(e => e.PurchasedAt)
                .HasDefaultValueSql("(CONVERT([datetime],(sysdatetimeoffset() AT TIME ZONE 'N. Central Asia Standard Time')))")
                .HasColumnType("datetime")
                .HasColumnName("purchasedAt");
            entity.Property(e => e.Version).HasColumnName("version");

            entity.HasOne(d => d.Buyer).WithMany(p => p.DataPurchases)
                .HasForeignKey(d => d.BuyerId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__DataPurch__buyer__44CA3770");

            entity.HasOne(d => d.MarketSurvey).WithMany(p => p.DataPurchases)
                .HasForeignKey(d => d.MarketSurveyId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__DataPurch__marke__45BE5BA9");

            entity.HasMany(d => d.SurveyResponses).WithMany(p => p.DataPurchases)
                .UsingEntity<Dictionary<string, object>>(
                    "DataPurchaseDetail",
                    r => r.HasOne<SurveyResponse>().WithMany()
                        .HasForeignKey("SurveyResponseId")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK__DataPurch__surve__47A6A41B"),
                    l => l.HasOne<DataPurchase>().WithMany()
                        .HasForeignKey("DataPurchaseId")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK__DataPurch__dataP__46B27FE2"),
                    j =>
                    {
                        j.HasKey("DataPurchaseId", "SurveyResponseId");
                        j.ToTable("DataPurchaseDetail");
                        j.IndexerProperty<int>("DataPurchaseId").HasColumnName("dataPurchaseId");
                        j.IndexerProperty<int>("SurveyResponseId").HasColumnName("surveyResponseId");
                    });
        });

        modelBuilder.Entity<FilterTag>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__FilterTa__3213E83F9D0A92F0");

            entity.ToTable("FilterTag");

            entity.Property(e => e.Id)
                .ValueGeneratedNever()
                .HasColumnName("id");
            entity.Property(e => e.FilterTagTypeId).HasColumnName("filterTagTypeId");
            entity.Property(e => e.Name)
                .HasMaxLength(250)
                .HasColumnName("name");
            entity.Property(e => e.TagColor)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("tagColor");

            entity.HasOne(d => d.FilterTagType).WithMany(p => p.FilterTags)
                .HasForeignKey(d => d.FilterTagTypeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__FilterTag__filte__489AC854");
        });

        modelBuilder.Entity<FilterTagType>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__FilterTa__3213E83F1BCEA833");

            entity.ToTable("FilterTagType");

            entity.Property(e => e.Id)
                .ValueGeneratedNever()
                .HasColumnName("id");
            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .HasColumnName("name");
        });

        modelBuilder.Entity<PasswordResetToken>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Password__3213E83FF151F129");

            entity.ToTable("PasswordResetToken");

            entity.HasIndex(e => e.Token, "UQ__Password__CA90DA7A80DEB869").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.AccountId).HasColumnName("accountId");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(CONVERT([datetime],(sysdatetimeoffset() AT TIME ZONE 'N. Central Asia Standard Time')))")
                .HasColumnType("datetime")
                .HasColumnName("createdAt");
            entity.Property(e => e.ExpiredAt)
                .HasColumnType("datetime")
                .HasColumnName("expiredAt");
            entity.Property(e => e.IsUsed).HasColumnName("isUsed");
            entity.Property(e => e.Token)
                .HasMaxLength(256)
                .HasColumnName("token");

            entity.HasOne(d => d.Account).WithMany(p => p.PasswordResetTokens)
                .HasForeignKey(d => d.AccountId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__PasswordR__accou__498EEC8D");
        });

        modelBuilder.Entity<Role>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Role__3213E83F2F455A3A");

            entity.ToTable("Role");

            entity.Property(e => e.Id)
                .ValueGeneratedNever()
                .HasColumnName("id");
            entity.Property(e => e.Name)
                .HasMaxLength(20)
                .HasColumnName("name");
        });

        modelBuilder.Entity<Survey>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Survey__3213E83F16B4B603");

            entity.ToTable("Survey", tb => tb.HasTrigger("trg_Survey_Update"));

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.AllocBaseAmount)
                .HasColumnType("decimal(18, 2)")
                .HasColumnName("allocBaseAmount");
            entity.Property(e => e.AllocLevelAmount)
                .HasColumnType("decimal(18, 2)")
                .HasColumnName("allocLevelAmount");
            entity.Property(e => e.AllocTimeAmount)
                .HasColumnType("decimal(18, 2)")
                .HasColumnName("allocTimeAmount");
            entity.Property(e => e.ConfigJsonString)
                .HasDefaultValue("")
                .HasColumnName("configJsonString");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(CONVERT([datetime],(sysdatetimeoffset() AT TIME ZONE 'N. Central Asia Standard Time')))")
                .HasColumnType("datetime")
                .HasColumnName("createdAt");
            entity.Property(e => e.DeletedAt)
                .HasColumnType("datetime")
                .HasColumnName("deletedAt");
            entity.Property(e => e.Description).HasColumnName("description");
            entity.Property(e => e.EndDate).HasColumnName("endDate");
            entity.Property(e => e.ExtraPrice)
                .HasColumnType("decimal(18, 2)")
                .HasColumnName("extraPrice");
            entity.Property(e => e.IsAvailable).HasColumnName("isAvailable");
            entity.Property(e => e.Kpi).HasColumnName("kpi");
            entity.Property(e => e.MaxXp).HasColumnName("maxXp");
            entity.Property(e => e.ProfitPrice)
                .HasColumnType("decimal(18, 2)")
                .HasColumnName("profitPrice");
            entity.Property(e => e.PublishedAt)
                .HasColumnType("datetime")
                .HasColumnName("publishedAt");
            entity.Property(e => e.RequesterId).HasColumnName("requesterId");
            entity.Property(e => e.SecurityModeId).HasColumnName("securityModeId");
            entity.Property(e => e.StartDate).HasColumnName("startDate");
            entity.Property(e => e.SurveySpecificTopicId).HasColumnName("surveySpecificTopicId");
            entity.Property(e => e.SurveyTopicId).HasColumnName("surveyTopicId");
            entity.Property(e => e.SurveyTypeId).HasColumnName("surveyTypeId");
            entity.Property(e => e.TakerBaseRewardPrice)
                .HasColumnType("decimal(18, 2)")
                .HasColumnName("takerBaseRewardPrice");
            entity.Property(e => e.TheoryPrice)
                .HasColumnType("decimal(18, 2)")
                .HasColumnName("theoryPrice");
            entity.Property(e => e.Title)
                .HasMaxLength(250)
                .HasColumnName("title");
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("(CONVERT([datetime],(sysdatetimeoffset() AT TIME ZONE 'N. Central Asia Standard Time')))")
                .HasColumnType("datetime")
                .HasColumnName("updatedAt");

            entity.HasOne(d => d.Requester).WithMany(p => p.Surveys)
                .HasForeignKey(d => d.RequesterId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Survey__requeste__4D5F7D71");

            entity.HasOne(d => d.SecurityMode).WithMany(p => p.Surveys)
                .HasForeignKey(d => d.SecurityModeId)
                .HasConstraintName("FK__Survey__security__51300E55");

            entity.HasOne(d => d.SurveySpecificTopic).WithMany(p => p.Surveys)
                .HasForeignKey(d => d.SurveySpecificTopicId)
                .HasConstraintName("FK__Survey__surveySp__503BEA1C");

            entity.HasOne(d => d.SurveyTopic).WithMany(p => p.Surveys)
                .HasForeignKey(d => d.SurveyTopicId)
                .HasConstraintName("FK__Survey__surveyTo__4F47C5E3");

            entity.HasOne(d => d.SurveyType).WithMany(p => p.Surveys)
                .HasForeignKey(d => d.SurveyTypeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Survey__surveyTy__4E53A1AA");
        });

        modelBuilder.Entity<SurveyCommunityTransaction>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__SurveyCo__3213E83F9DF5967B");

            entity.ToTable("SurveyCommunityTransaction");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.AccountId).HasColumnName("accountId");
            entity.Property(e => e.Amount)
                .HasColumnType("decimal(18, 2)")
                .HasColumnName("amount");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(CONVERT([datetime],(sysdatetimeoffset() AT TIME ZONE 'N. Central Asia Standard Time')))")
                .HasColumnType("datetime")
                .HasColumnName("createdAt");
            entity.Property(e => e.Profit)
                .HasColumnType("decimal(18, 2)")
                .HasColumnName("profit");
            entity.Property(e => e.SurveyId).HasColumnName("surveyId");
            entity.Property(e => e.TransactionStatusId).HasColumnName("transactionStatusId");
            entity.Property(e => e.TransactionTypeId).HasColumnName("transactionTypeId");

            entity.HasOne(d => d.Account).WithMany(p => p.SurveyCommunityTransactions)
                .HasForeignKey(d => d.AccountId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__SurveyCom__accou__04AFB25B");

            entity.HasOne(d => d.Survey).WithMany(p => p.SurveyCommunityTransactions)
                .HasForeignKey(d => d.SurveyId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__SurveyCom__surve__05A3D694");

            entity.HasOne(d => d.TransactionStatus).WithMany(p => p.SurveyCommunityTransactions)
                .HasForeignKey(d => d.TransactionStatusId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__SurveyCom__trans__078C1F06");

            entity.HasOne(d => d.TransactionType).WithMany(p => p.SurveyCommunityTransactions)
                .HasForeignKey(d => d.TransactionTypeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__SurveyCom__trans__0697FACD");
        });

        modelBuilder.Entity<SurveyDefaultBackgroundTheme>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__SurveyDe__3213E83F97F6DD92");

            entity.ToTable("SurveyDefaultBackgroundTheme");

            entity.Property(e => e.Id)
                .ValueGeneratedNever()
                .HasColumnName("id");
            entity.Property(e => e.ConfigJsonString)
                .HasDefaultValue("")
                .HasColumnName("configJsonString");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(CONVERT([datetime],(sysdatetimeoffset() AT TIME ZONE 'N. Central Asia Standard Time')))")
                .HasColumnType("datetime")
                .HasColumnName("createdAt");
        });

        modelBuilder.Entity<SurveyFeedback>(entity =>
        {
            entity.HasKey(e => new { e.SurveyId, e.TakerId });

            entity.ToTable("SurveyFeedback", tb => tb.HasTrigger("trg_SurveyFeedback_Update"));

            entity.Property(e => e.SurveyId).HasColumnName("surveyId");
            entity.Property(e => e.TakerId).HasColumnName("takerId");
            entity.Property(e => e.Comment)
                .HasMaxLength(500)
                .HasColumnName("comment");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(CONVERT([datetime],(sysdatetimeoffset() AT TIME ZONE 'N. Central Asia Standard Time')))")
                .HasColumnType("datetime")
                .HasColumnName("createdAt");
            entity.Property(e => e.RatingScore).HasColumnName("ratingScore");
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("(CONVERT([datetime],(sysdatetimeoffset() AT TIME ZONE 'N. Central Asia Standard Time')))")
                .HasColumnType("datetime")
                .HasColumnName("updatedAt");

            entity.HasOne(d => d.Survey).WithMany(p => p.SurveyFeedbacks)
                .HasForeignKey(d => d.SurveyId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__SurveyFee__surve__5224328E");

            entity.HasOne(d => d.Taker).WithMany(p => p.SurveyFeedbacks)
                .HasForeignKey(d => d.TakerId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__SurveyFee__taker__531856C7");
        });

        modelBuilder.Entity<SurveyFieldInputType>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__SurveyFi__3213E83FB5CEB328");

            entity.ToTable("SurveyFieldInputType");

            entity.Property(e => e.Id)
                .ValueGeneratedNever()
                .HasColumnName("id");
            entity.Property(e => e.Name)
                .HasMaxLength(250)
                .HasColumnName("name");
        });

        modelBuilder.Entity<SurveyGeneralConfig>(entity =>
        {
            entity.HasKey(e => e.ConfigProfileId).HasName("PK__SurveyGe__D540A1242461F63E");

            entity.ToTable("SurveyGeneralConfig");

            entity.Property(e => e.ConfigProfileId)
                .ValueGeneratedNever()
                .HasColumnName("configProfileId");
            entity.Property(e => e.BasePriceAllocationRate).HasColumnName("basePriceAllocationRate");
            entity.Property(e => e.LevelPriceAllocationRate).HasColumnName("levelPriceAllocationRate");
            entity.Property(e => e.PricePerQuestion)
                .HasColumnType("decimal(18, 2)")
                .HasColumnName("pricePerQuestion");
            entity.Property(e => e.PublishProfitRate).HasColumnName("publishProfitRate");
            entity.Property(e => e.TimePriceAllocationRate).HasColumnName("timePriceAllocationRate");
            entity.Property(e => e.XpPerQuestion).HasColumnName("xpPerQuestion");

            entity.HasOne(d => d.ConfigProfile).WithOne(p => p.SurveyGeneralConfig)
                .HasForeignKey<SurveyGeneralConfig>(d => d.ConfigProfileId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__SurveyGen__confi__540C7B00");
        });

        modelBuilder.Entity<SurveyMarket>(entity =>
        {
            entity.HasKey(e => new { e.SurveyId, e.Version });

            entity.ToTable("SurveyMarket", tb => tb.HasTrigger("trg_SurveyMarket_Update"));

            entity.Property(e => e.SurveyId).HasColumnName("surveyId");
            entity.Property(e => e.Version).HasColumnName("version");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(CONVERT([datetime],(sysdatetimeoffset() AT TIME ZONE 'N. Central Asia Standard Time')))")
                .HasColumnType("datetime")
                .HasColumnName("createdAt");
            entity.Property(e => e.Description).HasColumnName("description");
            entity.Property(e => e.ExpiredAt)
                .HasColumnType("datetime")
                .HasColumnName("expiredAt");
            entity.Property(e => e.IsAvailable).HasColumnName("isAvailable");
            entity.Property(e => e.PricePerResponse)
                .HasColumnType("decimal(18, 2)")
                .HasColumnName("pricePerResponse");
            entity.Property(e => e.PublishAt)
                .HasColumnType("datetime")
                .HasColumnName("publishAt");
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("(CONVERT([datetime],(sysdatetimeoffset() AT TIME ZONE 'N. Central Asia Standard Time')))")
                .HasColumnType("datetime")
                .HasColumnName("updatedAt");

            entity.HasOne(d => d.Survey).WithMany(p => p.SurveyMarkets)
                .HasForeignKey(d => d.SurveyId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__SurveyMar__surve__55009F39");
        });

        modelBuilder.Entity<SurveyMarketConfig>(entity =>
        {
            entity.HasKey(e => e.ConfigProfileId).HasName("PK__SurveyMa__D540A124A4E5B677");

            entity.ToTable("SurveyMarketConfig");

            entity.Property(e => e.ConfigProfileId)
                .ValueGeneratedNever()
                .HasColumnName("configProfileId");
            entity.Property(e => e.DataTransactionProfitRate).HasColumnName("dataTransactionProfitRate");

            entity.HasOne(d => d.ConfigProfile).WithOne(p => p.SurveyMarketConfig)
                .HasForeignKey<SurveyMarketConfig>(d => d.ConfigProfileId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__SurveyMar__confi__55F4C372");
        });

        modelBuilder.Entity<SurveyMarketResponseVersion>(entity =>
        {
            entity.HasKey(e => new { e.SurveyResponseId, e.Version });

            entity.ToTable("SurveyMarketResponseVersion");

            entity.Property(e => e.SurveyResponseId).HasColumnName("surveyResponseId");
            entity.Property(e => e.Version).HasColumnName("version");

            entity.HasOne(d => d.SurveyResponse).WithMany(p => p.SurveyMarketResponseVersions)
                .HasForeignKey(d => d.SurveyResponseId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__SurveyMar__surve__56E8E7AB");
        });

        modelBuilder.Entity<SurveyMarketTransaction>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__SurveyMa__3213E83F9490C51E");

            entity.ToTable("SurveyMarketTransaction");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.AccountId).HasColumnName("accountId");
            entity.Property(e => e.Amount)
                .HasColumnType("decimal(18, 2)")
                .HasColumnName("amount");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(CONVERT([datetime],(sysdatetimeoffset() AT TIME ZONE 'N. Central Asia Standard Time')))")
                .HasColumnType("datetime")
                .HasColumnName("createdAt");
            entity.Property(e => e.DataPurchaseId).HasColumnName("dataPurchaseId");
            entity.Property(e => e.Profit)
                .HasColumnType("decimal(18, 2)")
                .HasColumnName("profit");
            entity.Property(e => e.TransactionStatusId).HasColumnName("transactionStatusId");
            entity.Property(e => e.TransactionTypeId).HasColumnName("transactionTypeId");

            entity.HasOne(d => d.Account).WithMany(p => p.SurveyMarketTransactions)
                .HasForeignKey(d => d.AccountId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__SurveyMar__accou__7E02B4CC");

            entity.HasOne(d => d.DataPurchase).WithMany(p => p.SurveyMarketTransactions)
                .HasForeignKey(d => d.DataPurchaseId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__SurveyMar__dataP__7EF6D905");

            entity.HasOne(d => d.TransactionStatus).WithMany(p => p.SurveyMarketTransactions)
                .HasForeignKey(d => d.TransactionStatusId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__SurveyMar__trans__00DF2177");

            entity.HasOne(d => d.TransactionType).WithMany(p => p.SurveyMarketTransactions)
                .HasForeignKey(d => d.TransactionTypeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__SurveyMar__trans__7FEAFD3E");
        });

        modelBuilder.Entity<SurveyMarketVersionStatusTracking>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__SurveyMa__3213E83F3164DABC");

            entity.ToTable("SurveyMarketVersionStatusTracking");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(CONVERT([datetime],(sysdatetimeoffset() AT TIME ZONE 'N. Central Asia Standard Time')))")
                .HasColumnType("datetime")
                .HasColumnName("createdAt");
            entity.Property(e => e.SurveyId).HasColumnName("surveyId");
            entity.Property(e => e.SurveyStatusId).HasColumnName("surveyStatusId");
            entity.Property(e => e.Version).HasColumnName("version");

            entity.HasOne(d => d.Survey).WithMany(p => p.SurveyMarketVersionStatusTrackings)
                .HasForeignKey(d => d.SurveyId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__SurveyMar__surve__57DD0BE4");

            entity.HasOne(d => d.SurveyStatus).WithMany(p => p.SurveyMarketVersionStatusTrackings)
                .HasForeignKey(d => d.SurveyStatusId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__SurveyMar__surve__58D1301D");
        });

        modelBuilder.Entity<SurveyOption>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__SurveyOp__3213E83F997B00DA");

            entity.ToTable("SurveyOption");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Content)
                .HasMaxLength(500)
                .HasColumnName("content");
            entity.Property(e => e.Order).HasColumnName("order");
            entity.Property(e => e.SurveyQuestionId).HasColumnName("surveyQuestionId");

            entity.HasOne(d => d.SurveyQuestion).WithMany(p => p.SurveyOptions)
                .HasForeignKey(d => d.SurveyQuestionId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__SurveyOpt__surve__6CD828CA");
        });

        modelBuilder.Entity<SurveyQuestion>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__SurveyQu__3213E83F2EAE63B7");

            entity.ToTable("SurveyQuestion");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.ConfigJsonString)
                .HasDefaultValue("")
                .HasColumnName("configJsonString");
            entity.Property(e => e.Content)
                .HasMaxLength(500)
                .HasColumnName("content");
            entity.Property(e => e.DeletedAt)
                .HasColumnType("datetime")
                .HasColumnName("deletedAt");
            entity.Property(e => e.Description)
                .HasMaxLength(500)
                .HasColumnName("description");
            entity.Property(e => e.IsReanswerRequired)
                .HasDefaultValue(false)
                .HasColumnName("isReanswerRequired");
            entity.Property(e => e.IsVoiced).HasColumnName("isVoiced");
            entity.Property(e => e.Order).HasColumnName("order");
            entity.Property(e => e.QuestionTypeId).HasColumnName("questionTypeId");
            entity.Property(e => e.ReferenceSurveyQuestionId).HasColumnName("referenceSurveyQuestionId");
            entity.Property(e => e.SurveyId).HasColumnName("surveyId");
            entity.Property(e => e.TimeLimit)
                .HasDefaultValue(10)
                .HasColumnName("timeLimit");
            entity.Property(e => e.Version).HasColumnName("version");

            entity.HasOne(d => d.QuestionType).WithMany(p => p.SurveyQuestions)
                .HasForeignKey(d => d.QuestionTypeId)
                .HasConstraintName("FK__SurveyQue__quest__6EC0713C");

            entity.HasOne(d => d.ReferenceSurveyQuestion).WithMany(p => p.InverseReferenceSurveyQuestion)
                .HasForeignKey(d => d.ReferenceSurveyQuestionId)
                .HasConstraintName("FK_SurveyQuestion_Reference");

            entity.HasOne(d => d.Survey).WithMany(p => p.SurveyQuestions)
                .HasForeignKey(d => d.SurveyId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__SurveyQue__surve__6DCC4D03");
        });

        modelBuilder.Entity<SurveyQuestionType>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__SurveyQu__3213E83FFFD64818");

            entity.ToTable("SurveyQuestionType");

            entity.Property(e => e.Id)
                .ValueGeneratedNever()
                .HasColumnName("id");
            entity.Property(e => e.DeactivatedAt)
                .HasDefaultValueSql("(CONVERT([datetime],(sysdatetimeoffset() AT TIME ZONE 'N. Central Asia Standard Time')))")
                .HasColumnType("datetime")
                .HasColumnName("deactivatedAt");
            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .HasColumnName("name");
            entity.Property(e => e.Price)
                .HasColumnType("decimal(18, 2)")
                .HasColumnName("price");
        });

        modelBuilder.Entity<SurveyResponse>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__SurveyRe__3213E83F56F5AC7B");

            entity.ToTable("SurveyResponse");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.IsValid).HasColumnName("isValid");
            entity.Property(e => e.SurveyQuestionId).HasColumnName("surveyQuestionId");
            entity.Property(e => e.SurveyTakenResultId).HasColumnName("surveyTakenResultId");
            entity.Property(e => e.ValueJsonString).HasColumnName("valueJsonString");

            entity.HasOne(d => d.SurveyQuestion).WithMany(p => p.SurveyResponses)
                .HasForeignKey(d => d.SurveyQuestionId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__SurveyRes__surve__719CDDE7");

            entity.HasOne(d => d.SurveyTakenResult).WithMany(p => p.SurveyResponses)
                .HasForeignKey(d => d.SurveyTakenResultId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__SurveyRes__surve__5D95E53A");
        });

        modelBuilder.Entity<SurveyRewardTracking>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__SurveyRe__3213E83F99E01540");

            entity.ToTable("SurveyRewardTracking");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(CONVERT([datetime],(sysdatetimeoffset() AT TIME ZONE 'N. Central Asia Standard Time')))")
                .HasColumnType("datetime")
                .HasColumnName("createdAt");
            entity.Property(e => e.RewardPrice)
                .HasColumnType("decimal(18, 2)")
                .HasColumnName("rewardPrice");
            entity.Property(e => e.RewardXp).HasColumnName("rewardXp");
            entity.Property(e => e.SurveyId).HasColumnName("surveyId");

            entity.HasOne(d => d.Survey).WithMany(p => p.SurveyRewardTrackings)
                .HasForeignKey(d => d.SurveyId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__SurveyRew__surve__5F7E2DAC");
        });

        modelBuilder.Entity<SurveySecurityMode>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__SurveySe__3213E83F50C59BD1");

            entity.ToTable("SurveySecurityMode");

            entity.Property(e => e.Id)
                .ValueGeneratedNever()
                .HasColumnName("id");
            entity.Property(e => e.Description).HasColumnName("description");
            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .HasColumnName("name");
        });

        modelBuilder.Entity<SurveySecurityModeConfig>(entity =>
        {
            entity.HasKey(e => new { e.ConfigProfileId, e.SurveySecurityModeId });

            entity.ToTable("SurveySecurityModeConfig");

            entity.Property(e => e.ConfigProfileId).HasColumnName("configProfileId");
            entity.Property(e => e.SurveySecurityModeId).HasColumnName("surveySecurityModeId");
            entity.Property(e => e.Rate).HasColumnName("rate");

            entity.HasOne(d => d.ConfigProfile).WithMany(p => p.SurveySecurityModeConfigs)
                .HasForeignKey(d => d.ConfigProfileId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__SurveySec__confi__607251E5");

            entity.HasOne(d => d.SurveySecurityMode).WithMany(p => p.SurveySecurityModeConfigs)
                .HasForeignKey(d => d.SurveySecurityModeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__SurveySec__surve__6166761E");
        });

        modelBuilder.Entity<SurveySpecificTopic>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__SurveySp__3213E83FDDFEDCC3");

            entity.ToTable("SurveySpecificTopic");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .HasColumnName("name");
            entity.Property(e => e.SurveyTopicId).HasColumnName("surveyTopicId");

            entity.HasOne(d => d.SurveyTopic).WithMany(p => p.SurveySpecificTopics)
                .HasForeignKey(d => d.SurveyTopicId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__SurveySpe__surve__625A9A57");
        });

        modelBuilder.Entity<SurveyStatus>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__SurveySt__3213E83F1CC2DE73");

            entity.ToTable("SurveyStatus");

            entity.Property(e => e.Id)
                .ValueGeneratedNever()
                .HasColumnName("id");
            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .HasColumnName("name");
        });

        modelBuilder.Entity<SurveyStatusTracking>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__SurveySt__3213E83F17FAB5FD");

            entity.ToTable("SurveyStatusTracking");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(CONVERT([datetime],(sysdatetimeoffset() AT TIME ZONE 'N. Central Asia Standard Time')))")
                .HasColumnType("datetime")
                .HasColumnName("createdAt");
            entity.Property(e => e.SurveyId).HasColumnName("surveyId");
            entity.Property(e => e.SurveyStatusId).HasColumnName("surveyStatusId");

            entity.HasOne(d => d.Survey).WithMany(p => p.SurveyStatusTrackings)
                .HasForeignKey(d => d.SurveyId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__SurveySta__surve__634EBE90");

            entity.HasOne(d => d.SurveyStatus).WithMany(p => p.SurveyStatusTrackings)
                .HasForeignKey(d => d.SurveyStatusId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__SurveySta__surve__6442E2C9");
        });

        modelBuilder.Entity<SurveyTagFilter>(entity =>
        {
            entity.HasKey(e => new { e.SurveyId, e.FilterTagId });

            entity.ToTable("SurveyTagFilter");

            entity.Property(e => e.SurveyId).HasColumnName("surveyId");
            entity.Property(e => e.FilterTagId).HasColumnName("filterTagId");
            entity.Property(e => e.Summary).HasColumnName("summary");

            entity.HasOne(d => d.FilterTag).WithMany(p => p.SurveyTagFilters)
                .HasForeignKey(d => d.FilterTagId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__SurveyTag__filte__662B2B3B");

            entity.HasOne(d => d.Survey).WithMany(p => p.SurveyTagFilters)
                .HasForeignKey(d => d.SurveyId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__SurveyTag__surve__65370702");
        });

        modelBuilder.Entity<SurveyTakenResult>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__SurveyTa__3213E83F1F92A343");

            entity.ToTable("SurveyTakenResult");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CompletedAt)
                .HasDefaultValueSql("(CONVERT([datetime],(sysdatetimeoffset() AT TIME ZONE 'N. Central Asia Standard Time')))")
                .HasColumnType("datetime")
                .HasColumnName("completedAt");
            entity.Property(e => e.InvalidReason)
                .HasMaxLength(500)
                .HasColumnName("invalidReason");
            entity.Property(e => e.IsValid).HasColumnName("isValid");
            entity.Property(e => e.MoneyEarned)
                .HasColumnType("decimal(18, 2)")
                .HasColumnName("moneyEarned");
            entity.Property(e => e.SurveyId).HasColumnName("surveyId");
            entity.Property(e => e.TakerId).HasColumnName("takerId");
            entity.Property(e => e.XpEarned).HasColumnName("xpEarned");

            entity.HasOne(d => d.Survey).WithMany(p => p.SurveyTakenResults)
                .HasForeignKey(d => d.SurveyId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__SurveyTak__surve__671F4F74");

            entity.HasOne(d => d.Taker).WithMany(p => p.SurveyTakenResults)
                .HasForeignKey(d => d.TakerId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__SurveyTak__taker__681373AD");
        });

        modelBuilder.Entity<SurveyTakenResultTagFilter>(entity =>
        {
            entity.HasKey(e => new { e.SurveyTakenResultId, e.AdditionalFilterTagId });

            entity.ToTable("SurveyTakenResultTagFilter");

            entity.Property(e => e.SurveyTakenResultId).HasColumnName("surveyTakenResultId");
            entity.Property(e => e.AdditionalFilterTagId).HasColumnName("additionalFilterTagId");
            entity.Property(e => e.Summary).HasColumnName("summary");

            entity.HasOne(d => d.AdditionalFilterTag).WithMany(p => p.SurveyTakenResultTagFilters)
                .HasForeignKey(d => d.AdditionalFilterTagId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__SurveyTak__addit__69FBBC1F");

            entity.HasOne(d => d.SurveyTakenResult).WithMany(p => p.SurveyTakenResultTagFilters)
                .HasForeignKey(d => d.SurveyTakenResultId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__SurveyTak__surve__690797E6");
        });

        modelBuilder.Entity<SurveyTakerSegment>(entity =>
        {
            entity.HasKey(e => e.SurveyId);

            entity.ToTable("SurveyTakerSegment");

            entity.Property(e => e.SurveyId)
                .ValueGeneratedNever()
                .HasColumnName("surveyId");
            entity.Property(e => e.AverageIncome)
                .HasMaxLength(250)
                .HasColumnName("averageIncome");
            entity.Property(e => e.CountryRegion)
                .HasMaxLength(250)
                .HasColumnName("countryRegion");
            entity.Property(e => e.EducationLevel)
                .HasMaxLength(250)
                .HasColumnName("educationLevel");
            entity.Property(e => e.JobField)
                .HasMaxLength(250)
                .HasColumnName("jobField");
            entity.Property(e => e.MaritalStatus)
                .HasMaxLength(250)
                .HasColumnName("maritalStatus");
            entity.Property(e => e.Prompt).HasColumnName("prompt");
            entity.Property(e => e.TagFilterAccuracyRate).HasColumnName("tagFilterAccuracyRate");

            entity.HasOne(d => d.Survey).WithOne(p => p.SurveyTakerSegment)
                .HasForeignKey<SurveyTakerSegment>(d => d.SurveyId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__SurveyTak__surve__6AEFE058");
        });

        modelBuilder.Entity<SurveyTimeRateConfig>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__SurveyTi__3213E83F3EF92543");

            entity.ToTable("SurveyTimeRateConfig");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.ConfigProfileId).HasColumnName("configProfileId");
            entity.Property(e => e.MaxDurationRate).HasColumnName("maxDurationRate");
            entity.Property(e => e.MinDurationRate).HasColumnName("minDurationRate");
            entity.Property(e => e.Rate).HasColumnName("rate");

            entity.HasOne(d => d.ConfigProfile).WithMany(p => p.SurveyTimeRateConfigs)
                .HasForeignKey(d => d.ConfigProfileId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__SurveyTim__confi__6BE40491");
        });

        modelBuilder.Entity<SurveyTopic>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__SurveyTo__3213E83FD06892A5");

            entity.ToTable("SurveyTopic");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .HasColumnName("name");
        });

        modelBuilder.Entity<SurveyTopicFavorite>(entity =>
        {
            entity.HasKey(e => new { e.AccountId, e.SurveyTopicId });

            entity.ToTable("SurveyTopicFavorite");

            entity.Property(e => e.AccountId).HasColumnName("accountId");
            entity.Property(e => e.SurveyTopicId).HasColumnName("surveyTopicId");
            entity.Property(e => e.FavoriteScore).HasColumnName("favoriteScore");

            entity.HasOne(d => d.Account).WithMany(p => p.SurveyTopicFavorites)
                .HasForeignKey(d => d.AccountId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__SurveyTop__accou__6DCC4D03");

            entity.HasOne(d => d.SurveyTopic).WithMany(p => p.SurveyTopicFavorites)
                .HasForeignKey(d => d.SurveyTopicId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__SurveyTop__surve__6CD828CA");
        });

        modelBuilder.Entity<SurveyType>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__SurveyTy__3213E83FC74F9E35");

            entity.ToTable("SurveyType");

            entity.Property(e => e.Id)
                .ValueGeneratedNever()
                .HasColumnName("id");
            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .HasColumnName("name");
        });

        modelBuilder.Entity<SystemConfigProfile>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__SystemCo__3213E83F631D0F14");

            entity.ToTable("SystemConfigProfile", tb => tb.HasTrigger("trg_SystemConfigProfile_Update"));

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(CONVERT([datetime],(sysdatetimeoffset() AT TIME ZONE 'N. Central Asia Standard Time')))")
                .HasColumnType("datetime")
                .HasColumnName("createdAt");
            entity.Property(e => e.Description).HasColumnName("description");
            entity.Property(e => e.IsActive).HasColumnName("isActive");
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .HasColumnName("name");
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("(CONVERT([datetime],(sysdatetimeoffset() AT TIME ZONE 'N. Central Asia Standard Time')))")
                .HasColumnType("datetime")
                .HasColumnName("updatedAt");
        });

        modelBuilder.Entity<TakerTagFilter>(entity =>
        {
            entity.HasKey(e => new { e.TakerId, e.FilterTagId });

            entity.ToTable("TakerTagFilter");

            entity.Property(e => e.TakerId).HasColumnName("takerId");
            entity.Property(e => e.FilterTagId).HasColumnName("filterTagId");
            entity.Property(e => e.Summary).HasColumnName("summary");

            entity.HasOne(d => d.FilterTag).WithMany(p => p.TakerTagFilters)
                .HasForeignKey(d => d.FilterTagId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__TakerTagF__filte__6FB49575");

            entity.HasOne(d => d.Taker).WithMany(p => p.TakerTagFilters)
                .HasForeignKey(d => d.TakerId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__TakerTagF__taker__6EC0713C");
        });

        modelBuilder.Entity<TransactionStatus>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Transact__3213E83F106B87C5");

            entity.ToTable("TransactionStatus");

            entity.Property(e => e.Id)
                .ValueGeneratedNever()
                .HasColumnName("id");
            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .HasColumnName("name");
        });

        modelBuilder.Entity<TransactionType>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Transact__3213E83FEAE05E19");

            entity.ToTable("TransactionType");

            entity.Property(e => e.Id)
                .ValueGeneratedNever()
                .HasColumnName("id");
            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .HasColumnName("name");
            entity.Property(e => e.OperationType)
                .HasMaxLength(20)
                .HasColumnName("operationType");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
