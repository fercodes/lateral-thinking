export default function PrivacyPolicy() {
  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Privacy Policy</h1>

      <p className="mb-6">
        <strong>Last updated:</strong> {new Date().toISOString().split('T')[0]}
      </p>

      <h2 className="text-xl font-medium mt-6 mb-2">Information Collected</h2>
      <p>
        When you interact with this AI agent, messages and basic interaction
        metadata (such as timestamps) may be processed. No sensitive personal
        data is intentionally collected.
      </p>

      <h2 className="text-xl font-medium mt-6 mb-2">
        Purpose of Data Processing
      </h2>
      <p>
        This AI agent is provided for demonstration and testing purposes only.
        Data is used solely to generate responses and to improve the quality of
        the demo experience. The specific behavior and knowledge of the AI agent
        may vary depending on the demonstration context.
      </p>

      <h2 className="text-xl font-medium mt-6 mb-2">Data Storage</h2>
      <p>
        Messages may be temporarily stored for debugging or testing purposes and
        are not retained longer than necessary.
      </p>

      <h2 className="text-xl font-medium mt-6 mb-2">Data Sharing</h2>
      <p>
        Data is not sold or shared with third parties, except when required to
        operate the service (such as messaging platforms or infrastructure
        providers).
      </p>

      <h2 className="text-xl font-medium mt-6 mb-2">Third-Party Services</h2>
      <p>
        This demo may rely on third-party services, including messaging
        platforms and AI providers. These services may process data according to
        their own privacy policies.
      </p>

      <h2 className="text-xl font-medium mt-6 mb-2">Contact</h2>
      <p>
        If you have any questions about this Privacy Policy, please contact us.
      </p>
    </main>
  );
}
