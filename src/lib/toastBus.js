const bus = new EventTarget();

export function showToast({
  title = "",
  description = "",
  type = "info",
  duration = 3500,
}) {
  const id = Date.now() + Math.random();
  bus.dispatchEvent(
    new CustomEvent("toast", {
      detail: { id, title, description, type, duration },
    })
  );
  return id;
}

export function removeToast(id) {
  bus.dispatchEvent(new CustomEvent("remove-toaster", { detail: { id } }));
}

export default bus;
