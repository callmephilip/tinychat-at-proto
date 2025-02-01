import { DigestCard } from "@tinychat/ui/layout/digest-card.tsx";

export const CreateServerPage = () => {
  return (
    <DigestCard title="Create server">
      <form action="/new" method="post">
        <input
          name="name"
          placeholder="your server name"
          data-testid="server-name"
        />
        <button type="submit" data-testid="create-server">
          Create
        </button>
      </form>
    </DigestCard>
  );
};
