const { AbilityBuilder, createMongoAbility } = require('@casl/ability');

const Actions = {
    read: "read",
    create: "create",
    update: "update",
    delete: "delete"
};

const Entitys = {
    User: "User",
    Repo: "Repo",
    Commit: "Commit"
};

module.exports = {
    Entitys: Entitys,
    Actions: Actions,
    GetAbility: function (req) {
        const { can, cannot, build } = new AbilityBuilder(createMongoAbility);
        
        switch (req.role) {
            case "User":
                can([Actions.create, Actions.update], [Entitys.Commit, Entitys.Repo], { userId: req.user.id });
                can(Actions.read, [Entitys.Commit, Entitys.Repo]);
                can(Actions.read, [Entitys.User], { userId: req.user.id });
                
                cannot(Actions.delete, [Entitys.Commit, Entitys.Repo]);
                break;
            case "Admin":
                can([Actions.delete, Actions.update, Actions.read], [Entitys.Commit, Entitys.Repo]);
                can(Actions.read, [Entitys.User]);

                cannot(Actions.create, [Entitys.Commit, Entitys.Repo]);
                break;
            case "Guest":
            default:
                can(Actions.read, [Entitys.Commit, Entitys.Repo]);
                break;
        }

        return build();
    }
}