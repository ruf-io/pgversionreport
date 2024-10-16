export default function HowToUpgrade() {
    return (
        <div className="prose">
            <h3 className="text-xl font-bold">Upgrade on Managed Hosts</h3>
            <p>
                Please see the documentation for your managed PostgreSQL
                provider:
            </p>
            <ul>
                <li>
                    <a href="https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_UpgradeDBInstance.PostgreSQL.html">AWS RDS Postgres</a>
                </li>
                <li>
                    <a href="https://cloud.google.com/sql/docs/postgres/upgrade-major-db-version-inplace">Google Cloud SQL Postgres</a>
                </li>
                <li>
                    <a href="https://devcenter.heroku.com/articles/upgrading-heroku-postgres-databases">Heroku Postgres</a>
                </li>
                <li>
                    <a href="https://neon.tech/docs/postgresql/postgres-upgrade">Neon</a>
                </li>
                <li>
                    <a href="https://supabase.com/docs/guides/platform/migrating-and-upgrading-projects">
                        Supabase
                    </a>
                </li>
                <li>
                    <a href="https://tembo.io/docs/getting-started/postgres_guides/how-to-upgrade-postgres-versions">
                        Tembo
                    </a>
                </li>
                <li>
                    <a href="https://access.crunchydata.com/documentation/postgres-operator/latest/guides/major-postgres-version-upgrade">
                        Crunchy Data
                    </a>
                </li>
                <li>
                    <a href="https://xata.io/docs/postgres">Xata</a>
                </li>
            </ul>

            <h3 className="text-xl font-bold">Upgrade on Self-Managed Hosts</h3>
            <p>
                To upgrade PostgreSQL on a self-managed host, you can{" "}
                <a href="https://www.postgresql.org/docs/current/upgrading.html">
                    follow the official PostgreSQL documentation
                </a>
                . The distribution of your version will depend on your operating
                systems package manager.
            </p>
        </div>
    );
}
