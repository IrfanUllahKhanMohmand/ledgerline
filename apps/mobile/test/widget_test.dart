import 'package:flutter_test/flutter_test.dart';
import 'package:ledgerline/main.dart';

void main() {
  testWidgets('shows items and retries a failed upload', (tester) async {
    await tester.pumpWidget(const LedgerlineApp());

    expect(find.text('Ledgerline'), findsOneWidget);
    expect(find.text('Cafe receipt'), findsOneWidget);
    expect(find.text('Pharmacy bill'), findsOneWidget);
    expect(find.textContaining('Upload failed'), findsOneWidget);

    await tester.tap(find.text('Retry'));
    await tester.pump();
    expect(find.textContaining('Uploading'), findsOneWidget);

    await tester.pump(const Duration(milliseconds: 250));
    expect(find.textContaining('Uploaded'), findsWidgets);
    expect(find.text('Retry'), findsNothing);
  });
}
