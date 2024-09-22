BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[commits] (
    [id] INT NOT NULL IDENTITY(1,1),
    [message] NVARCHAR(1000),
    [repoid] INT NOT NULL,
    CONSTRAINT [commits_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[repos] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000),
    [authorid] INT NOT NULL,
    CONSTRAINT [repos_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[users] (
    [id] INT NOT NULL IDENTITY(1,1),
    [username] NVARCHAR(1000) NOT NULL,
    [password] NVARCHAR(1000) NOT NULL,
    [email] NVARCHAR(1000) NOT NULL,
    [role] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [users_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[commits] ADD CONSTRAINT [commits_repoid_fkey] FOREIGN KEY ([repoid]) REFERENCES [dbo].[repos]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[repos] ADD CONSTRAINT [repos_authorid_fkey] FOREIGN KEY ([authorid]) REFERENCES [dbo].[users]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
