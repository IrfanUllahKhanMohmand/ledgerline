import 'package:flutter_test/flutter_test.dart';
import 'package:ledgerline/main.dart';

void main() {
  testWidgets('shows scaffold home', (tester) async {
    await tester.pumpWidget(const LedgerlineApp());

    expect(find.text('Ledgerline'), findsOneWidget);
    expect(find.text('Sample receipt'), findsOneWidget);
  });
}
