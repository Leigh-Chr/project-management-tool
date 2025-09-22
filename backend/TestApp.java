public class TestApp {
    public static void main(String[] args) {
        System.out.println("Hello Railway!");
        // Keep the app running
        try {
            Thread.sleep(Long.MAX_VALUE);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
}
